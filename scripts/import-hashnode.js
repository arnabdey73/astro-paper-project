// Import Hashnode blog posts to Astro markdown files
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BLOG_URL = 'myinfraascode.hashnode.space';
const OUTPUT_DIR = join(__dirname, '../src/data/blog');

const HASHNODE_QUERY = `
  query GetUserArticles($host: String!) {
    publication(host: $host) {
      posts(first: 50) {
        edges {
          node {
            title
            slug
            publishedAt
            content {
              markdown
            }
            tags {
              name
            }
            brief
          }
        }
      }
    }
  }
`;

async function fetchHashnodePosts() {
  const response = await fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': process.env.HASHNODE_TOKEN,
    },
    body: JSON.stringify({
      query: HASHNODE_QUERY,
      variables: {
        host: BLOG_URL
      }
    })
  });

  const data = await response.json();
  console.log('API Response:', JSON.stringify(data, null, 2));
  return data?.data?.publication?.posts?.edges || [];
}

function convertToAstroFrontmatter(post) {
  const date = new Date(post.publishedAt);
  const tags = (post.tags || []).map(t => t.name.toLowerCase());
  
  return `---
title: ${post.title}
author: Arnab Dey
pubDatetime: ${date.toISOString()}
featured: false
draft: false
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
description: ${post.brief || ''}
---

${post.content.markdown}`;
}

async function main() {
  try {
    // Create the output directory if it doesn't exist
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Fetch posts from Hashnode
    const posts = await fetchHashnodePosts();
    console.log(`Found ${posts.length} posts`);

    // Convert and save each post
    for (const { node: post } of posts) {
      const content = convertToAstroFrontmatter(post);
      const filePath = join(OUTPUT_DIR, `${post.slug}.md`);
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`Saved: ${post.slug}.md`);
    }

    console.log('Import completed successfully!');
  } catch (error) {
    console.error('Error importing posts:', error);
  }
}

main();
