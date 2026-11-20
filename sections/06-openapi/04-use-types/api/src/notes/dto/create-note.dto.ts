import { z } from 'zod';
import type { components } from '../../api/schema.js';
import type { Equal, Expect } from '../../api/type-check.js';

/** openapi.yaml の CreateNoteInput */
type CreateNoteInput = components['schemas']['CreateNoteInput'];

/** メモを作るときに受け取る値。本文は省略すると空になる。 */
export const createNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100),
  body: z.string().max(1000).default(''),
}) satisfies z.ZodType<unknown, CreateNoteInput>;
export type CreateNoteDto = z.infer<typeof createNoteSchema>;

// スキーマが受け付ける形と、openapi.yaml の形が「ぴったり同じ」かを確かめる。
// satisfies では見つけられない、余分な項目や足りない省略可能な項目もエラーになる。
export type CreateNoteDtoMatchesApi = Expect<
  Equal<z.input<typeof createNoteSchema>, CreateNoteInput>
>;
