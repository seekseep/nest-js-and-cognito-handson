import { z } from 'zod';
import type { components } from '../api/schema.js';
import type { Equal, Expect } from '../api/type-check.js';

// openapi.yaml の components.schemas から作った型
type Schemas = components['schemas'];

/** メモ 1 件の形。openapi.yaml の Note。 */
export type Note = Schemas['Note'];

// タイトルと本文の決まり。作成と更新で同じものを使う。
const title = z.string().trim().min(1).max(100);
const body = z.string().max(1000);

/** メモを作るときに受け取る値。本文は省略すると空になる。 */
export const createNoteSchema = z.strictObject({
  title,
  body: body.default(''),
}) satisfies z.ZodType<unknown, Schemas['CreateNoteInput']>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

/**
 * メモを更新するときに受け取る値。どの項目も省略できる。
 * createNoteSchema.partial() にすると、本文の default('') が効いて
 * 「タイトルだけ変えたのに本文が消える」ので、既定値なしで別に書く。
 */
export const updateNoteSchema = z.strictObject({
  title: title.optional(),
  body: body.optional(),
}) satisfies z.ZodType<unknown, Schemas['UpdateNoteInput']>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

/** URL の :id。 */
export const noteIdSchema = z.uuid();

// スキーマが受け付ける形と、openapi.yaml の形が「ぴったり同じ」かを確かめる。
// satisfies では見つけられない、余分な項目や足りない省略可能な項目もエラーになる。
export type CreateNoteInputMatchesApi = Expect<
  Equal<z.input<typeof createNoteSchema>, Schemas['CreateNoteInput']>
>;
export type UpdateNoteInputMatchesApi = Expect<
  Equal<z.input<typeof updateNoteSchema>, Schemas['UpdateNoteInput']>
>;
