import { headers } from "next/headers";

const siteUrl = "https://www.taxi2airport.com.au";
const productionHosts = ["taxi2airport.com.au", "www.taxi2airport.com.au"];

export default async function robots() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  if (!productionHosts.includes(host)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    sitemap: `${siteUrl}/sitemap.xml`
  };
}
