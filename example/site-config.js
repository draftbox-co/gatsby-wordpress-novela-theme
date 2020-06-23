module.exports = {
  siteUrl: "https://wp-balsa-preview.draftbox.com", // Site domain. Do not include a trailing slash!

  postsPerPage: 10, // Number of posts shown on paginated pages (changes this requires sometimes to delete the cache)

  siteTitleMeta: "Built with Draftbox", // This allows an alternative site title for meta data for pages.
  siteDescriptionMeta:
    "Lightning fast, secure front-end for your WordPress or Ghost blog, without coding", // This allows an alternative site description for meta data for pages.

  shareImageWidth: 1000, // Change to the width of your default share image
  shareImageHeight: 523, // Change to the height of your default share image

  shortTitle: "Built with Draftbox", // Used for App manifest e.g. Mobile Home Screen
  siteIcon: "favicon.png", // Logo in /static dir used for SEO, RSS, and App manifest
  backgroundColor: "#e9e9e9", // Used for Offline Manifest
  themeColor: "#15171A", // Used for Offline Manifest
  apiUrl: "https://wordpress.theasdfghjkl.com",
  subscribeWidget: {
    title: "Subscribe to Draftbox",
    helpText: "Get the latest posts delivered right to your inbox.",
    successMessage: "Thanks for subscribing to Draftbox.",
  },
  header: {
    navigation: [
      {
        label: "Home",
        url: "https://wp-balsa-preview.draftbox.com/",
      },
      {
        label: "Contact",
        url: "https://wp-balsa-preview.draftbox.com/contact",
      },
    ],
  },
  footer: {
    copyright: "Built with Draftbox",
    navigation: [
      {
        label: "Home",
        url: "https://wp-balsa-preview.draftbox.com/",
      },
      {
        label: "Sitemap",
        url: "https://wp-balsa-preview.draftbox.com/sitemap.xml",
      },
      {
        label: "RSS",
        url: "https://wp-balsa-preview.draftbox.com/rss.xml",
      },
      {
        label: "Contact",
        url: "https://wp-balsa-preview.draftbox.com/contact",
      },
      {
        label: "External Link",
        url: "https://spectrum.chat/gatsby-js/themes?tab=posts",
      },
    ],
  },
  socialLinks: {
    twitter: "https://twitter.com/draftboxhq",
    facebook: "https://facebook.com/",
    instagram: "https://www.instagram.com/",
    linkedin: "https://linkedin.com/",
    github: "https://github.com/draftbox-co",
  },
  contactWidget: {
    title: "Contact Built with Draftbox",
    successMessage: "We’ll get in touch with you soon.",
  },
};
