const siteUrl = "https://www.taxi2airport.com.au";
const lastModified = new Date("2026-08-10");

const pages = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/wheelchair-accessible-taxi-sydney", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cruise-transfers-sydney", priority: 0.8, changeFrequency: "monthly" },
  { path: "/maxi-cab-group-transfers-sydney", priority: 0.8, changeFrequency: "monthly" },
  { path: "/corporate-airport-transfers-sydney", priority: 0.8, changeFrequency: "monthly" },
  { path: "/baby-seat-taxi-sydney", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sydney-airport-to-blue-mountains-transfer", priority: 0.8, changeFrequency: "monthly" }
];

export default function sitemap() {
  return pages.map(({ path, priority, changeFrequency }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority
  }));
}
