// middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.format();
    console.warn('[validateBody] Validation failed', { errors });
    return res.status(400).json({ error: 'Invalid input', details: errors });
  }

  // Overwrite req.body with parsed+typed data
  req.body = result.data;
  next();
};
