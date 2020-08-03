/* eslint-disable */

// https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-transformer-sharp/src/fragments.js

const GatsbyFluid_withWebp = `
  base64
  aspectRatio
  src
  srcSet
  sizes
`;

module.exports.wordpress = {
  articles: `{
    articles: allWordpressPost(
      sort: {fields: [sticky, date], order: [DESC, DESC]}
    ) {
      edges {
        node {
          id
          link
          slug: permaLinkSlug
          body: mdx
          title: plainTitle
          excerpt: plainExcerpt
          readingTime
          featured: sticky
          date(formatString: "MMMM Do, YYYY")
          tags: tags_custom {
            name
            slug
            postCount: count
          }
          author {
            name
            slug
            avatar_urls {
              wordpress_96
            }
            bio:description
          }
          featured_media_custom {
            localFile {
              publicURL
            }
          }
          hero: featured_media_custom {
            localFile {
              full: childImageSharp {
                fluid(maxWidth: 944, quality: 100) {
                  ${GatsbyFluid_withWebp}
                }
              }
              regular: childImageSharp {
                fluid(maxWidth: 653, quality: 100) {
                  ${GatsbyFluid_withWebp}
                }
              }
              narrow: childImageSharp {
                fluid(maxWidth: 457, quality: 100) {
                  ${GatsbyFluid_withWebp}
                }
              }
              seo: childImageSharp {
                fixed(width: 1200, quality: 100) {
                  src
                }
              }
            }
          } 
          modified(formatString: "MMMM Do, YYYY")
          seoDate: date(formatString: "MMMM DD YYYY")
          seoModifiedDate: modified(formatString: "MMMM DD YYYY")
        }
      }
    }
  }`,
  pages: `{
    pages: allWordpressPage{
      edges {
        node {
          id
          link
          slug
          body: mdx
          title: plainTitle
          excerpt: plainExcerpt
          readingTime
          date(formatString: "MMMM Do, YYYY")
          author {
            name
            slug
            avatar_urls {
              wordpress_96
            }
            bio:description
          }
          featured_media_custom {
            localFile {
              publicURL
            }
          }
          hero: featured_media_custom {
            localFile {
              full: childImageSharp {
                fluid(maxWidth: 944, quality: 100) {
                  ${GatsbyFluid_withWebp}
                }
              }
              regular: childImageSharp {
                fluid(maxWidth: 653, quality: 100) {
                  ${GatsbyFluid_withWebp}
                }
              }
              narrow: childImageSharp {
                fluid(maxWidth: 457, quality: 100) {
                  ${GatsbyFluid_withWebp}
                }
              }
              seo: childImageSharp {
                fixed(width: 1200, quality: 100) {
                  src
                }
              }
            }
          } 
          modified(formatString: "MMMM Do, YYYY")
          seoDate: date(formatString: "MMMM DD YYYY")
          seoModifiedDate: modified(formatString: "MMMM DD YYYY") 
        }
      }
    }
  }`,
  authors: `{
    authors: allWordpressWpUsers {
      edges {
        node {
          name
          slug
          bio: description
          avatar_urls {
            wordpress_96
          }
        }
      }
    }
  }`,
  tags: `{
    tags: allWordpressTag(filter: { count: { gt: 0 } }) {
      edges {
        node {
          name
          slug
          description
          postCount: count
        }
      }
    }
  }`,
  siteMetadata: `{
    site {
      siteMetadata {
        apiUrl
        siteTitle
      }
    }
  }`,
};
