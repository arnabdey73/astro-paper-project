export function checkBlogPosts() {
  const fs = require("fs");
  const path = require("path");
  
  const blogDir = path.join(__dirname, "src", "data", "blog");
  const files = fs.readdirSync(blogDir);
  
  files.forEach(file => {
    if (file.endsWith(".md")) {
      const content = fs.readFileSync(path.join(blogDir, file), "utf-8");
      const frontmatter = content.split("---")[1];
      console.log(`File: ${file}`);
      console.log(frontmatter);
      console.log("--------------------------------------");
    }
  });
}

checkBlogPosts();
