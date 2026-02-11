import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Auros Corretora Imobiliária",
    short_name: "Auros",
    description:
      "Imóveis à venda em Rio do Sul e Balneário Camboriú com a Auros Corretora Imobiliária.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#17375F",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "32x32",
        type: "image/x-icon",
      },
    ],
  }
}
