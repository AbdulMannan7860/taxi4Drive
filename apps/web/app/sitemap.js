const siteUrl = "https://taxi2airport.com.au";

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/#about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${siteUrl}/#fleet`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${siteUrl}/#contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8
    }
  ];
}
