import { useEffect } from "react";
import { app } from "../data/dashboard";

export function useTitle(title: string) {
  useEffect(() => {
    document.title = `${title} | ${app.name}`;
  }, [title]);
}
