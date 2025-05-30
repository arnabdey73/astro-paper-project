// A simple script to help debug the issue
import { getCollection } from "astro:content";

async function listPosts() {
  try {
    console.log("Fetching blog posts...");
    const posts = await getCollection("blog");
    console.log(`Found ${posts.length} posts`);
    
    posts.forEach(post => {
      console.log(`- ${post.id}: ${post.data.title} (draft: ${post.data.draft}, pub: ${post.data.pubDatetime})`);
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

listPosts();
