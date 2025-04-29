import { z } from 'zod';

export const logEntryInputSchema = z.object({
  userName: z.string().min(1, 'userName is required'),
  description: z.string().min(1, 'description is required'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  location: z.string().min(1, 'location is required'),
});
