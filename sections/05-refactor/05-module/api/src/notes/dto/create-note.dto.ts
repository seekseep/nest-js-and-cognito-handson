import { z } from 'zod';
import type { CreateNoteInput } from '../../api/index.js';

/** POST /notes の本文の決まり。openapi.yaml の CreateNoteInput に合わせる。 */
export const createNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(1000).default(''),
}) satisfies z.ZodType<unknown, CreateNoteInput>;

/** 決まりを通したあとの値 */
export type CreateNoteDto = z.infer<typeof createNoteSchema>;
