import { z } from 'zod';
import type { components } from '../../api/schema.js';

type UpdateNoteInput = components['schemas']['UpdateNoteInput'];

/** PUT /notes/:id の本文の決まり。openapi.yaml の UpdateNoteInput に合わせる。 */
export const updateNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(1000),
}) satisfies z.ZodType<unknown, UpdateNoteInput>;

/** 決まりを通したあとの値 */
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;
