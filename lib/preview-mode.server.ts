import { cookies } from "next/headers"
import {
  PREVIEW_MODE_COOKIE,
  resolvePreviewMode,
  type PreviewMode,
} from "@/lib/preview-env"

export async function getRequestPreviewMode(): Promise<PreviewMode> {
  const jar = await cookies()
  return resolvePreviewMode(jar.get(PREVIEW_MODE_COOKIE)?.value)
}
