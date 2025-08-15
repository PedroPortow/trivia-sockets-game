import { PlayerContext } from "@/context/PlayerProvider";
import { useContext } from "react";

export default function usePlayer() {
  const ctx = useContext(PlayerContext)

  if (!ctx) {
    throw new Error('tá fora do provider...')
  }

  return ctx
}
