"use server"

import { revalidateTag } from "next/cache"

export async function revalidateVisualConfig() {
  revalidateTag("visual-config", "default")
}
