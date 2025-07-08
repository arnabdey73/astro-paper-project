import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";
import { SITE } from "@/config";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @param fullUrl - whether to return a full URL with domain (for RSS feeds)
 * @returns blog post path or URL
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true,
  fullUrl = false
) {
  try {
    if (!id) {
      throw new Error("Post ID is required");
    }
    
    // Extract path segments safely
    const pathSegments = filePath
      ? filePath
          .replace(BLOG_PATH, "")
          .split("/")
          .filter(path => path !== "") // remove empty string in the segments ["", "other-path"]
          .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
          .slice(0, -1) // remove the last segment (file name) since it's unnecessary
          .map(segment => slugifyStr(segment)) // slugify each segment path
      : [];

    const basePath = includeBase ? "/posts" : "";

    // Making sure `id` does not contain the directory
    const blogId = id.split("/");
    const slug = blogId.length > 0 ? blogId.slice(-1) : blogId;

    // Build the path
    let path;
    if (!pathSegments || pathSegments.length < 1) {
      path = [basePath, slug].join("/");
    } else {
      path = [basePath, ...pathSegments, slug].join("/");
    }
    
    // Return full URL if requested
    if (fullUrl) {
      try {
        // Ensure SITE.website ends with a slash for proper URL joining
        const baseUrl = SITE.website.endsWith("/") ? SITE.website : `${SITE.website}/`;
        // Remove leading slash from path to avoid double slashes
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        return new URL(cleanPath, baseUrl).toString();
      } catch (error) {
        console.error("Error creating full URL:", error);
        // Fallback to relative path if URL creation fails
        return path;
      }
    }
    
    return path;
  } catch (error) {
    console.error("Error in getPath:", error);
    // Provide a fallback path if something goes wrong
    return includeBase ? `/posts/${id.split("/").pop()}` : id.split("/").pop() || "";
  }
}
