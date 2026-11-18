/** メモ 1 件の形。 */
export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

/** メモを作るときに受け取る値。 */
export interface CreateNoteInput {
  title: string;
  body: string;
}
