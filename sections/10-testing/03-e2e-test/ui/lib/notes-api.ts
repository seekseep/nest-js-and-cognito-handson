// API のメモ API を呼ぶ関数をまとめる。

import { client } from "./api/client";
import type { components } from "./api/schema";

// 型は openapi.yaml から作ったものを使う（手で書かない）
export type Note = components["schemas"]["Note"];
export type CreateNoteInput = components["schemas"]["CreateNoteInput"];
type ApiError = components["schemas"]["Error"];

/** API のエラー（messages の配列）を 1 つの Error にする。 */
function toError(error: ApiError): Error {
  return new Error(error.messages.join("\n"));
}

export async function listNotes(): Promise<Note[]> {
  const { data, error } = await client.GET("/notes");
  if (error) throw toError(error);
  return data;
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const { data, error } = await client.POST("/notes", { body: input });
  if (error) throw toError(error);
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await client.DELETE("/notes/{id}", {
    params: { path: { id } },
  });
  if (error) throw toError(error);
}
