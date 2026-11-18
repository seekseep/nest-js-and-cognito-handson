// BFF のメモ API を呼ぶ関数をまとめる。

import { fetchAuthSession } from "aws-amplify/auth";

// BFF の URL。ブラウザから呼ぶので、Mac から見た localhost:3001 になる。
// NEXT_PUBLIC_ で始まる環境変数は、ビルドのときにコードへ埋め込まれる。
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  body: string;
}

/**
 * サインイン中のユーザーのアクセストークンを、Authorization ヘッダーにする。
 * fetchAuthSession は、トークンの期限が切れていれば自動で取り直す。
 */
async function authHeaders(): Promise<Record<string, string>> {
  const { tokens } = await fetchAuthSession();
  const accessToken = tokens?.accessToken.toString();
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
}

/** レスポンスが 2xx でなければ、BFF のエラーメッセージを付けて投げる。 */
async function ensureOk(res: Response): Promise<Response> {
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    const message = Array.isArray(error?.message)
      ? error.message.join("\n")
      : (error?.message ?? res.statusText);
    throw new Error(message);
  }
  return res;
}

export async function listNotes(): Promise<Note[]> {
  const res = await ensureOk(
    await fetch(`${API_URL}/notes`, { headers: await authHeaders() }),
  );
  return res.json();
}

export async function createNote(input: CreateNoteInput): Promise<Note> {
  const res = await ensureOk(
    await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(await authHeaders()),
      },
      body: JSON.stringify(input),
    }),
  );
  return res.json();
}

export async function deleteNote(id: string): Promise<void> {
  await ensureOk(
    await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: await authHeaders(),
    }),
  );
}
