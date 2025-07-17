"use client";

import { Toaster } from "sonner";

export default function CustomToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: "bg-black text-white px-4 py-2 rounded-md shadow-md",
      }}
    />
  );
}
