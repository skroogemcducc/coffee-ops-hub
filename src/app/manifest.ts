import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coffee Ops Hub",
    short_name: "Ops Hub",
    description:
      "A mobile-first operations hub for task handoff, shared goals, and owner coordination.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1713",
    theme_color: "#0b1713",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
