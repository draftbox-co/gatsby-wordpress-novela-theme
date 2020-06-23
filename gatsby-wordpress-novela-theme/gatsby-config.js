/* eslint-disable */

const siteConfigDefaults = require(`./src/utils/siteConfigDefaults`);
const path = require("path");
const { buildPermaSlug } = require(`./src/utils/buildPermaSlug`);

module.exports = (themeOptions) => {
  const siteConfig = themeOptions.siteConfig || siteConfigDefaults;
  const wordpressConfig = themeOptions.wordpressConfig;

  return {
    pathPrefix: "",
    siteMetadata: siteConfig,
    plugins: [
      `gatsby-plugin-typescript`,
      `gatsby-image`,
      `gatsby-plugin-react-helmet`,
      `gatsby-plugin-sharp`,
      `gatsby-transformer-sharp`,
      `gatsby-plugin-mdx`,
      `gatsby-plugin-catch-links`,
      `gatsby-plugin-force-trailing-slashes`,
      `gatsby-plugin-offline`,
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: path.join(__dirname, `src`, `images`),
          name: `images`,
        },
      },
      {
        resolve: `gatsby-plugin-emotion`,
        options: {
          displayName: process.env.NODE_ENV === `development`,
        },
      },
      {
        resolve: `gatsby-source-wordpress`,
        options: wordpressConfig,
      },
      {
        resolve: `@armada-inc/gatsby-plugin-amp`,
        options: {
          canonicalBaseUrl: siteConfig.siteUrl,
          components: [`amp-form`],
          excludedPaths: [`/404*`, `/`],
          pathIdentifier: `amp/`,
          relAmpHtmlPattern: `{{canonicalBaseUrl}}{{pathname}}{{pathIdentifier}}`,
          useAmpClientIdApi: true,
          dirName: __dirname,
          themePath: `src/amp-styles/post.amp.css`,
        },
      },
      {
        resolve: `gatsby-plugin-manifest`,
        options: {
          name: siteConfig.siteTitleMeta,
          short_name: siteConfig.shortTitle,
          start_url: `/`,
          background_color: siteConfig.backgroundColor,
          theme_color: siteConfig.themeColor,
          display: `standalone`,
          icon: "static/favicon.png",
        },
      },
      {
        resolve: `gatsby-plugin-feed`,
        options: {
          query: `
            {
              site {
                siteMetadata {
                  siteUrl
                  apiUrl
                }
              }
            }
          `,
          feeds: [
            {
              serialize: ({ query: { site, allWordpressPost } }) => {
                return allWordpressPost.edges.map((edge) => {
                  return {
                    title: edge.node.title,
                    description: edge.node.excerpt,
                    date: edge.node.date,
                    url:
                      site.siteMetadata.siteUrl +
                      buildPermaSlug(edge.node.link, site.siteMetadata.apiUrl),
                    guid:
                      site.siteMetadata.siteUrl +
                      buildPermaSlug(edge.node.link, site.siteMetadata.apiUrl),
                    custom_elements: [{ "content:encoded": edge.node.content }],
                  };
                });
              },
              query: `
                {
                  allWordpressPost(sort: {fields: date, order: DESC}) {
                    edges {
                      node {
                        slug
                        link
                        content
                        title
                        excerpt
                        date
                      }
                    }
                  }
                }
              `,
              output: "/rss.xml",
              title: siteConfig.siteTitleMeta,
            },
          ],
        },
      },
      // {
      //   resolve: `gatsby-plugin-advanced-sitemap`,
      //   options: {
      //     query: `{
      //       allGhostPost {
      //         edges {
      //           node {
      //             id
      //             slug
      //             updated_at
      //             created_at
      //             feature_image
      //           }
      //         }
      //       }
      //       allGhostPage {
      //         edges {
      //           node {
      //             id
      //             slug
      //             updated_at
      //             created_at
      //             feature_image
      //           }
      //         }
      //       }
      //       allGhostTag {
      //         edges {
      //           node {
      //             id
      //             slug
      //             feature_image
      //           }
      //         }
      //       }
      //       allGhostAuthor {
      //         edges {
      //           node {
      //             id
      //             slug
      //             profile_image
      //           }
      //         }
      //       }
      //     }
      //     `,
      //     mapping: {
      //       allGhostPost: {
      //         sitemap: `posts`,
      //       },
      //       allGhostTag: {
      //         sitemap: `tags`,
      //       },
      //       allGhostAuthor: {
      //         sitemap: `authors`,
      //       },
      //       allGhostPage: {
      //         sitemap: `pages`,
      //       },
      //     },
      //     exclude: [
      //       `/dev-404-page`,
      //       `/404`,
      //       `/404.html`,
      //       `/offline-plugin-app-shell-fallback`,
      //     ],
      //     createLinkInHead: true,
      //     addUncaughtPages: true,
      //   },
      // },
      `gatsby-plugin-theme-ui`,
      {
        resolve: `gatsby-plugin-remove-generator`,
        options: {
          content: `Draftbox`,
        },
      },
    ],
  };
};
