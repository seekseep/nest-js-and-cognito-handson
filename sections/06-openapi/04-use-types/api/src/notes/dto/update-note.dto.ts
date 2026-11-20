import { z } from 'zod';
import type { components } from '../../api/schema.js';
import type { Equal, Expect } from '../../api/type-check.js';

/** openapi.yaml の UpdateNoteInput */
type UpdateNoteInput = components['schemas']['UpdateNoteInput'];

/**
 * メモを更新するときに受け取る値。どの項目も省略できる。
 * createNoteSchema.partial() にすると、本文の default('') が効いて
 * 「タイトルだけ変えたのに本文が消える」ので、既定値なしで別に書く。
 */
export const updateNoteSchema = z.strictObject({
  title: z.string().trim().min(1).max(100).optional(),
  body: z.string().max(1000).optional(),
}) satisfies z.ZodType<unknown, UpdateNoteInput>;
export type UpdateNoteDto = z.infer<typeof updateNoteSchema>;

// スキーマが受け付ける形と、openapi.yaml の形が「ぴったり同じ」かを確かめる。
export type UpdateNoteDtoMatchesApi = Expect<
  Equal<z.input<typeof updateNoteSchema>, UpdateNoteInput>
>;
