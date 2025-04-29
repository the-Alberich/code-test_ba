import { z } from 'zod';

export const logEntryInputSchema = z.object({
  userName: z.string().min(1, 'User name is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  location: z.string().min(1, 'Location is required'),
});

export type LogEntryInput = z.infer<typeof logEntryInputSchema>;
