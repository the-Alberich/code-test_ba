import { Router } from 'express';
import { createLog, updateLog, deleteLog, getLogs } from '../controllers/logController';
import { validateBody } from '../middleware/validate';
import { logEntryInputSchema } from '../schemas/logSchema';

const router = Router();

router.get('/logs', getLogs);
router.post('/logs', validateBody(logEntryInputSchema), createLog);
router.put('/logs/:id', validateBody(logEntryInputSchema), updateLog);
router.delete('/logs/:id', deleteLog);

export default router;
