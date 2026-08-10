export default function manifest() {
  return {
    name: "Taxi2Airport | Sydney Airport Transfers",
    short_name: "Taxi2Airport",
    description: "Sydney airport transfers, maxi cabs, wheelchair accessible taxis and cruise transfers, 24/7.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B1D33",
    theme_color: "#0B1D33",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };
}
