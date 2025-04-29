import { z } from 'zod';

export const logEntryInputSchema = z.object({
  userName: z.string().min(1, 'User name is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Date is required',
  }),
  location: z.string().min(1, 'Location is required'),
});

export const logEntrySchema = logEntryInputSchema.extend({
  id: z.string().uuid(),
});

export type LogEntryInput = z.infer<typeof logEntryInputSchema>;
export type LogEntry = z.infer<typeof logEntrySchema>;
