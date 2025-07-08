import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import getSortedPosts from "@/utils/getSortedPosts";
import { SITE } from "@/config";

export async function GET() {
  try {
    const posts = await getCollection("blog");
    const sortedPosts = getSortedPosts(posts);
    
    // Ensure we have a valid site URL
    const siteUrl = new URL(SITE.website).toString().replace(/\/+$/, "");
    
    return rss({
      title: SITE.title,
      description: SITE.desc,
      site: siteUrl,
      items: sortedPosts.map(({ data, id, filePath }) => {
        try {
          return {
            link: getPath(id, filePath),
            title: data.title,
            description: data.description,
            pubDate: new Date(data.modDatetime ?? data.pubDatetime),
          };
        } catch (error) {
          console.error(`Error creating RSS item for ${id}:`, error);
          return {
            link: `${siteUrl}/posts/${id.split("/").pop()}`,
            title: data.title || "Unknown Title",
            description: data.description || "No description available",
            pubDate: new Date(),
          };
        }
      }),
    });
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    
    // Return a minimal valid RSS feed if there's an error
    return rss({
      title: SITE.title,
      description: "Error generating complete RSS feed",
      site: SITE.website,
      items: [],
    });
  }
}
