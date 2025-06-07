"use client";
import { useState } from "react";

let setOpenGlobal: (open: boolean) => void = () => {};

export function useSearchDrawerController() {
  const [open, setOpen] = useState(false);
  setOpenGlobal = setOpen;
  return { open, setOpen };
}

export function useSearchDrawer() {
  return {
    open: () => setOpenGlobal(true),
    close: () => setOpenGlobal(false),
  };
}
