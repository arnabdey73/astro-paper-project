// Debug utility to check post visibility
import { getCollection } from "astro:content";
import postFilter from "./src/utils/postFilter.js";

async function debugPosts() {
  try {
    // Get all posts
    const posts = await getCollection("blog");
    console.log(`Found ${posts.length} total posts in collection`);
    
    // Log details for each post
    posts.forEach(post => {
      const now = new Date();
      const pubDate = new Date(post.data.pubDatetime);
      const isVisible = postFilter(post);
      
      console.log(`Post: ${post.id}`);
      console.log(`  Title: ${post.data.title}`);
      console.log(`  Author: ${post.data.author}`);
      console.log(`  Draft: ${post.data.draft}`);
      console.log(`  Pub Date: ${pubDate.toISOString()}`);
      console.log(`  Current Date: ${now.toISOString()}`);
      console.log(`  Is Future Date: ${pubDate > now}`);
      console.log(`  Would be visible: ${isVisible}`);
      console.log("-------------------------------");
    });
    
    // List visible posts
    const visiblePosts = posts.filter(postFilter);
    console.log(`\nVisible posts (${visiblePosts.length}):`);
    visiblePosts.forEach(post => {
      console.log(`- ${post.id}`);
    });
  } catch (error) {
    console.error("Error debugging posts:", error);
    console.error(error.stack);
  }
}

debugPosts();
