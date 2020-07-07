const htmlToMdx = require("@draftbox-co/html-to-compiled-mdx");
const readingTime = require("reading-time");
const htmlToText = require("html-to-text");
const handlers = require("../../utils/handlers");

module.exports = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions;
  createFieldExtension({
    name: "mdx",
    extend(options, prevFieldConfig) {
      return {
        resolve(source, context) {
          if (source.content) {
            const mdx = htmlToMdx(source.content, handlers);
            return mdx;
          } else {
            const mdx = htmlToMdx(`<div></div>`, handlers);
            return mdx;
          }
        },
      };
    },
  });

  createFieldExtension({
    name: "permaLinkSlug",
    extend(options, prevFieldConfig) {
      return {
        resolve(source, context) {
          if (source.link) {
            const pathName = new URL(source.link).pathname;
            return pathName.endsWith("/") ? pathName : pathName + "/";
          } else {
            return "";
          }
        },
      };
    },
  });

  createFieldExtension({
    name: "featured_media_custom",
    extend() {
      return {
        resolve(source, args, context, info) {
          if (source.featured_media___NODE) {
            return context.nodeModel.getNodeById({
              id: source.featured_media___NODE,
              type: "wordpress__wp_media",
            });
          }
          return null;
        },
      };
    },
  });

  createFieldExtension({
    name: "tags_custom",
    extend() {
      return {
        resolve(sources, args, context, info) {
          if (sources.tags___NODE && sources.tags___NODE.length > 0) {
            return sources.tags___NODE.map((tagNode) =>
              context.nodeModel.getNodeById({
                id: tagNode,
                type: `wordpress__TAG`,
              })
            );
          }
          return [];
        },
      };
    },
  });

  createFieldExtension({
    name: "plainExcerpt",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          let plainExcerpt = htmlToText
            .fromString(source.excerpt, {
              wordWrap: 155,
              ignoreHref: true,
            })
            .slice(0, 156);

          if (plainExcerpt.length > 155) {
            plainExcerpt = plainExcerpt.slice(0, 152) + "...";
          }
          return plainExcerpt;
        },
      };
    },
  });

  createFieldExtension({
    name: "plainTitle",
    extend(options, prevFieldConfig) {
      return {
        resolve(source) {
          let plainTitle = htmlToText.fromString(source.title).slice(0, 156);
          return plainTitle;
        },
      };
    },
  });

  createFieldExtension({
    name: "readingTime",
    extend() {
      return {
        resolve(source) {
          const readingTimeValue = readingTime(source.content);
          return readingTimeValue.text;
        },
      };
    },
  });

  createTypes(`
  type wordpress__POST implements Node {
    plainExcerpt: String @plainExcerpt
    readingTime: String @readingTime
    plainTitle: String @plainTitle
    tags_custom: [wordpress__TAG] @tags_custom
    featured_media_custom: wordpress__wp_media @featured_media_custom
    mdx: String @mdx
    permaLinkSlug: String @permaLinkSlug
  }
`);

  createTypes(`
  type wordpress__PAGE implements Node {
    plainExcerpt: String @plainExcerpt
    readingTime: String @readingTime
    plainTitle: String @plainTitle
    featured_media_custom: wordpress__wp_media @featured_media_custom
    mdx: String @mdx
  }
`);
};
