"use client";

import { useTransition } from "react";
import { deleteArtist } from "@/app/actions/artists";

export function DeleteArtistButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (window.confirm("Are you sure you want to remove this artist from the roster?")) {
          startTransition(async () => {
            await deleteArtist(id);
          });
        }
      }}
      disabled={isPending}
      className="inline-flex h-8 items-center justify-center rounded-md border border-destructive bg-transparent px-3 text-xs font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
