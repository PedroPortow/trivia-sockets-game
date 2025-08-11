import { PlayerContext } from "@/context/PlayerProvider";
import { useContext } from "react";

export default function usePlayer() {
  return useContext(PlayerContext)
}
