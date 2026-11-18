"use client";

import { useEffect, useState } from "react";
import { createNote, deleteNote, listNotes, type Note } from "@/lib/notes-api";

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  // 画面を開いたときに一覧を読み込む。静的書き出しのページなので、
  // データはビルドのときではなく、ブラウザで開いたときに BFF から取る。
  useEffect(() => {
    listNotes()
      .then(setNotes)
      .catch((e: Error) => setError(e.message));
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const note = await createNote({ title, body });
      setNotes([...notes, note]);
      setTitle("");
      setBody("");
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タイトル"
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="本文"
          rows={3}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="self-start rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900"
        >
          追加
        </button>
      </form>

      {error && (
        <p role="alert" className="whitespace-pre-line text-red-600">
          {error}
        </p>
      )}

      <ul className="flex flex-col gap-3">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex items-start justify-between gap-4 rounded border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <div>
              <h2 className="font-bold">{note.title}</h2>
              <p className="whitespace-pre-line text-zinc-600 dark:text-zinc-400">
                {note.body}
              </p>
            </div>
            <button
              onClick={() => handleDelete(note.id)}
              className="text-sm text-red-600"
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
