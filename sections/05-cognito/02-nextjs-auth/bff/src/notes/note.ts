import { z } from 'zod';

/** メモ 1 件の形。 */
export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

// タイトルと本文の決まり。作成と更新で同じものを使う。
const title = z.string().trim().min(1).max(100);
const body = z.string().max(1000);

/** メモを作るときに受け取る値。本文は省略すると空になる。 */
export const createNoteSchema = z.strictObject({
  title,
  body: body.default(''),
});
export type CreateNoteInput = z.infer<typeof createNoteSchema>;

/**
 * メモを更新するときに受け取る値。どの項目も省略できる。
 * createNoteSchema.partial() にすると、本文の default('') が効いて
 * 「タイトルだけ変えたのに本文が消える」ので、既定値なしで別に書く。
 */
export const updateNoteSchema = z.strictObject({
  title: title.optional(),
  body: body.optional(),
});
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;

/** URL の :id。 */
export const noteIdSchema = z.uuid();
