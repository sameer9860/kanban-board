"use client";

import Board from "../components/Board";

export default function Home() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full overflow-x-auto">
        <Board />
      </main>
    </div>
  );
}
