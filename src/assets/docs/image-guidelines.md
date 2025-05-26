# Blog Image Guidelines

This document provides guidelines for creating and using images in your blog posts.

## Cover Images

### Dimensions and Format
- **Recommended size**: 1200×630 pixels
- **Aspect ratio**: 1.91:1
- **Formats**: SVG, WebP (preferred), JPEG, PNG
- **File size**: Keep under 200KB for optimal performance

### Storage Location
Store your cover images in the following directory:
```
src/assets/images/covers/
```

Reference them in your post frontmatter like this:
```yaml
cover: "@assets/images/covers/your-image-name.svg"
coverAlt: "Descriptive alt text for accessibility"
```

## Social Media Cards (OG Images)

The blog automatically generates OG images for social media sharing based on your post title and description. These are generated with the dimensions 1200×630 pixels.

## Image Creation Tools

- **AI Image Generation**: Midjourney, DALL-E, or Stable Diffusion
- **Stock Photos**: Unsplash (free), Pexels (free), or Shutterstock (paid)
- **Design Tools**: Canva, Figma
- **Vector Graphics**: Adobe Illustrator, Inkscape (free)

## Best Practices

1. **Optimize all images** before uploading to keep your site fast
2. **Always provide alt text** for accessibility
3. **Use descriptive filenames** that reflect the image content
4. **Maintain consistency** in style across your blog posts
5. **Consider dark mode compatibility** when selecting images
