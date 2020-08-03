/* eslint-disable */

const siteConfigDefaults = require(`./src/utils/siteConfigDefaults`);
const path = require("path");

module.exports = (themeOptions) => {
  const siteConfig = themeOptions.siteConfig || siteConfigDefaults;
  const wordpressConfig = themeOptions.wordpressConfig;

  const configOptions = {
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
        resolve: `@draftbox-co/gatsby-plugin-amp`,
        options: {
          canonicalBaseUrl: siteConfig.siteUrl,
          components: [`amp-form`],
          excludedPaths: [`/404*`, `/`, `/offline*`],
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
                    url: site.siteMetadata.siteUrl + edge.node.slug,
                    guid: site.siteMetadata.siteUrl + edge.node.slug,
                    custom_elements: [{ "content:encoded": edge.node.content }],
                  };
                });
              },
              query: `
                {
                  allWordpressPost(sort: {fields: date, order: DESC}) {
                    edges {
                      node {
                        slug: permaLinkSlug
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
      {
        resolve: `gatsby-plugin-advanced-sitemap`,
        options: {
          query: `
                    {
                      allWordpressPost {
                        edges {
                          node {
                            id
                            slug: permaLinkSlug
                            date
                          }
                        }
                      }
                      allWordpressTag(filter: { count: { gt: 0 } }) {
                        edges {
                          node {
                            name
                            slug
                          }
                        }
                      }
                      allWordpressWpUsers {
                        edges {
                          node {
                            name
                            slug
                          }
                        }
                      }
                    }`,
          mapping: {
            allWordpressPost: {
              sitemap: `posts`,
            },
            allWordpressTag: {
              sitemap: `tags`,
            },
            allWordpressWpUsers: {
              sitemap: `authors`,
            },
          },
          exclude: [
            `/dev-404-page`,
            `/404`,
            `/404.html`,
            `/offline-plugin-app-shell-fallback`,
            `/offline`,
            `/offline.html`,
          ],
          createLinkInHead: true,
          addUncaughtPages: true,
        },
      },
      `gatsby-plugin-theme-ui`,
      {
        resolve: `gatsby-plugin-remove-generator`,
        options: {
          content: `Draftbox`,
        },
      },
      {
        resolve: `@draftbox-co/gatsby-plugin-css-variables`,
        options: {
          variables: siteConfig.themeConfig.variables,
        },
      },
    ],
  };

  if (siteConfig.themeConfig.fonts && siteConfig.themeConfig.fonts.length > 0) {
    configOptions.plugins.push({
      resolve: `@draftbox-co/gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: siteConfig.themeConfig.fonts,
        },
        formats: ["woff2", "woff"],
        useMinify: true,
        usePreload: true,
        usePreconnect: true,
        blacklist: ["/amp"],
      },
    })
  }

  return configOptions;
};
