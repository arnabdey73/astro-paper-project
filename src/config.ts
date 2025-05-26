export const SITE = {
  website: "https://blog.arnabdey.dev/", // your deployed domain
  author: "Arnab Dey",
  profile: "https://arnabdey.dev/",
  desc: "Personal blog of Arnab Dey - Thoughts, projects, and insights.",
  title: "Arnab's Blog",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerIndex: 6,
  postPerPage: 6,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Suggest Changes",
    url: "https://github.com/arnabd73/blog/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Asia/Kolkata", // Default global timezone (IANA format) for India
} as const;
