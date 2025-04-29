import { z } from 'zod';
import { logEntryInputSchema } from '../schemas/logSchema';

export const logEntrySchema = logEntryInputSchema.extend({
  id: z.string().uuid(),
});

export type LogEntry = z.infer<typeof logEntrySchema>;

export const logEntryChangedSchema = logEntrySchema.extend({
  changes: z.number().gte(1),
  lastInsertedRowid: z.number().gte(0)
});

export type LogEntryChanged = z.infer<typeof logEntryChangedSchema>;
