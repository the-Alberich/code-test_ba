import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database';
import { LogEntry, LogEntryChanged } from '../models/logModel';

function logError(context: string, req: Request, error: unknown) {
  console.error(`[${context}] Error`, {
    path: req.path,
    method: req.method,
    params: req.params,
    body: req.body,
    error,
  });
}

export const getLogs = (req: Request, res: Response) => {
  try {
    const stmt = db.prepare('SELECT * FROM logs ORDER BY date DESC');
    const logs: LogEntry[] = stmt.all();
    console.info('[logController.getLogs] Retrieved logs');
    res.json(logs);
  } catch (error) {
    logError('logController.getLogs', req, error);
    res.status(500).json({ error: 'Failed to retrieve logs.' });
  }
};

export const createLog = (req: Request, res: Response) => {
  try {
    const { userName, description, date, location } = req.body;

    if (!userName || !description || !date || !location) {
      console.warn('[logController.createLog] Missing fields', { body: req.body });
      return res.status(400).json({ error: 'All fields are required.' });
    }
  
    if (isNaN(Date.parse(date))) {
      console.warn('[logController.createLog] Invalid date format', { date });
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO logs (id, userName, description, date, location)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, userName, description, date, location);
    console.info('[logController.createLog] Created log', { id, userName });
    const result: LogEntry = { id, userName, description, date, location };
    res.status(201).json(result);
  } catch (error) {
    logError('logController.createLog', req, error);
    res.status(500).json({ error: 'Failed to create log.' });
  }
};

export const updateLog = (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userName, description, date, location } = req.body;
  
      if (!userName || !description || !date || !location) {
        console.warn('[logController.updateLog] Missing fields', { body: req.body });
        return res.status(400).json({ error: 'All fields are required.' });
      }
  
      if (isNaN(Date.parse(date))) {
        console.warn('[logController.updateLog] Invalid date format', { id });
        return res.status(400).json({ error: 'Invalid date format.' });
      }
  
      const stmt = db.prepare(`
        UPDATE logs
        SET userName = ?, description = ?, date = ?, location = ?
        WHERE id = ?
      `);
  
      const result = stmt.run(userName, description, date, location, id);
  
      if (result.changes === 0) {
        console.warn('[logController.updateLog] Log not found', { id });
        return res.status(404).json({ error: 'Log not found.' });
      }
  
      console.info('[logController.updateLog] Updated log', { id });

      const updatedLog: LogEntry = db.prepare('SELECT * FROM logs WHERE id = ?').get(id);
      res.json(updatedLog);
    } catch (error) {
      logError('logController.updateLog', req, error);
      res.status(500).json({ error: 'Failed to update log.' });
    }
  };

export const deleteLog = (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM logs WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      console.warn('[logController.deleteLog] Log not found', { id });
      return res.status(404).json({ error: 'Log not found.' });
    }

    console.info('[logController.deleteLog] Deleted log', { id });
    res.json({ message: 'Log deleted.' });
  } catch (error) {
    logError('logController.deleteLog', req, error);
    res.status(500).json({ error: 'Failed to delete log.' });
  }
};
