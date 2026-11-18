import { Auth } from "./auth";
import { Notes } from "./notes";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-bold">メモ</h1>
      <Auth>
        <Notes />
      </Auth>
    </main>
  );
}
