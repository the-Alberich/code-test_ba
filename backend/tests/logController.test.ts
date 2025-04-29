import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import * as logController from '../src/controllers/logController';
import db from '../src/database';

function mockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

function resetDatabase() {
  db.prepare('DELETE FROM logs').run();
}

describe('logController', () => {

  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    resetDatabase();
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a log and retrieves it', () => {
    const req: any = {
      body: {
        userName: 'Alice',
        description: 'Test event',
        date: new Date().toISOString(),
        location: 'Test City',
      },
    };
    const res = mockResponse();

    logController.createLog(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      userName: 'Alice',
      description: 'Test event',
      location: 'Test City',
    }));
    expect(infoSpy).toHaveBeenCalledWith('[logController.createLog] Created log', { id: expect.anything(), userName: 'Alice' });

    const getRes = mockResponse();
    logController.getLogs({} as any, getRes);
    expect(getRes.json).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ userName: 'Alice' }),
    ]));
    expect(infoSpy).toHaveBeenCalledWith('[logController.getLogs] Retrieved logs');
  });

  it('rejects creation if fields are missing', () => {
    const req: any = { body: { userName: 'MissingFields' } };
    const res = mockResponse();

    logController.createLog(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
  });

  it('returns 400 on creation if date is invalid', () => {
    const req: any = {
      body: {
        userName: 'Alice',
        description: 'Test event',
        date: 'not-a-date',
        location: 'Test City',
      },
    };
    const res = mockResponse();

    logController.createLog(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
    expect(warnSpy).toHaveBeenCalledWith('[logController.createLog] Invalid date format', { date: 'not-a-date' });
  });

  it('deletes a log', () => {
    const id = 'test-id';
    db.prepare(`
      INSERT INTO logs (id, userName, description, date, location)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, 'Bob', 'Delete test', new Date().toISOString(), 'Somewhere');

    const req: any = { params: { id } };
    const res = mockResponse();

    logController.deleteLog(req, res);
    expect(res.json).toHaveBeenCalledWith({ message: 'Log deleted.' });
  });

  it('updates a log and persists the change', () => {
    const id = 'update-test-id';
    db.prepare(`
      INSERT INTO logs (id, userName, description, date, location)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, 'Carol', 'Old description', new Date().toISOString(), 'Oldtown');

    const updatedData = {
      userName: 'Carol',
      description: 'Updated description',
      date: new Date().toISOString(),
      location: 'Newtown',
    };

    const req: any = { params: { id }, body: updatedData };
    const res = mockResponse();

    logController.updateLog(req, res);
    expect(res.json).toHaveBeenCalledWith({ id, ...updatedData });

    const row = db.prepare('SELECT * FROM logs WHERE id = ?').get(id);
    expect(row).toMatchObject({ id, ...updatedData });
  });

  it('returns 404 when updating non-existent log', () => {
    const req: any = {
      params: { id: 'does-not-exist' },
      body: {
        userName: 'Eve',
        description: 'Ghost update',
        date: new Date().toISOString(),
        location: 'Nowhere',
      },
    };
    const res = mockResponse();

    logController.updateLog(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Log not found.' });
  });

  it('returns 400 if required fields are missing during update', () => {
    const req: any = {
      params: { id: 'some-id' },
      body: {
        userName: 'Bob',
        // Missing description, date, location
      },
    };
    const res = mockResponse();

    logController.updateLog(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required.' });
    expect(warnSpy).toHaveBeenCalledWith('[logController.updateLog] Missing fields', expect.anything());
  });

  it('returns 400 if date is invalid', () => {
    const req: any = {
      params: { id: 'some-id' },
      body: {
        userName: 'Dana',
        description: 'Testing bad date',
        date: 'not-a-date',
        location: 'Someplace',
      },
    };
    const res = mockResponse();

    logController.updateLog(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format.' });
    expect(warnSpy).toHaveBeenCalledWith('[logController.updateLog] Invalid date format', { id: 'some-id' });
  });
});
