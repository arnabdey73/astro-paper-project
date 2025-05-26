// Middleware to handle image paths for Astro blog
import { type NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/assets/:path*',
    '/_astro/:path*'
  ],
};

export default function middleware(request: NextRequest) {
  // This middleware lets all requests through but could be expanded 
  // to handle dynamic image path resolution if needed
  return;
}
