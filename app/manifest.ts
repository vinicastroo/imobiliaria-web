import type { MetadataRoute } from "next"
import { getTenantIdentity } from "@/lib/tenant-info"
import { getTenantVisualConfig } from "@/lib/visual-config"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const [{ name }, visualConfig] = await Promise.all([
    getTenantIdentity(),
    getTenantVisualConfig(),
  ])

  const icon = visualConfig.faviconUrl ?? visualConfig.iconUrl

  return {
    name,
    short_name: name,
    description: `Imóveis à venda e para alugar com a ${name}.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: visualConfig.primaryColor,
    icons: icon
      ? [{ src: icon, sizes: "any", type: "image/png" }]
      : [{ src: "/favicon.ico", sizes: "32x32", type: "image/x-icon" }],
  }
}
