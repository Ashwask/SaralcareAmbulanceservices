import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.ambulance.saralcare.com",
  output: "static",
  trailingSlash: "ignore",
  build: {
    assets: "_assets",
  },
  vite: {
    ssr: {
      noExternal: ["maplibre-gl"],
    },
  },
});
