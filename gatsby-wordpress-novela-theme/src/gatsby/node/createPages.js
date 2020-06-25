/* eslint-disable no-console, import/no-extraneous-dependencies, prefer-const, no-shadow */

require("dotenv").config();

const fs = require("fs");

const log = (message, section) =>
  console.log(`\n\u001B[36m${message} \u001B[4m${section}\u001B[0m\u001B[0m\n`);

const path = require("path");
const createPaginatedPages = require("gatsby-paginate");

const templatesDirectory = path.resolve(__dirname, "../../templates");
const templates = {
  articles: path.resolve(templatesDirectory, "articles.template.tsx"),
  article: path.resolve(templatesDirectory, "article.template.tsx"),
  author: path.resolve(templatesDirectory, "author.template.tsx"),
  tag: path.resolve(templatesDirectory, "tag.template.tsx"),
  page: path.resolve(templatesDirectory, "page.template.tsx"),
  ampPage: path.resolve(templatesDirectory, "article.template.amp.tsx"),
};

const query = require("../data/data.query");
const normalize = require("../data/data.normalize");

// ///////////////// Utility functions ///////////////////

function buildPaginatedPath(index, basePath) {
  if (basePath === "/") {
    return index > 1 ? `${basePath}page/${index}` : basePath;
  }
  return index > 1 ? `${basePath}/page/${index}` : basePath;
}

function slugify(string, base) {
  const slug = string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return `${base}/${slug}`.replace(/\/\/+/g, "/");
}

function getUniqueListBy(array, key) {
  return [...new Map(array.map((item) => [item[key], item])).values()];
}

const byDate = (a, b) => new Date(b.dateForSEO) - new Date(a.dateForSEO);

// ///////////////////////////////////////////////////////

module.exports = async ({ actions: { createPage }, graphql }, themeOptions) => {
  const {
    rootPath,
    basePath = "/",
    authorsPath = "/authors",
    authorsPage = true,
    pageLength = 6,
    sources = {},
    mailchimp = "",
  } = themeOptions;

  const { data } = await graphql(`
    query siteQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  // Defaulting to look at the local MDX files as sources.
  const { local = true, contentful = false } = sources;

  let authors;
  let articles;
  let tags;
  let pages;
  let apiUrl;

  const dataSources = {
    wordPress: { authors: [], articles: [], tags: [], pages: [] },
  };

  if (rootPath) {
    log("Config rootPath", rootPath);
  } else {
    log("Config rootPath not set, using basePath instead =>", basePath);
  }

  log("Config basePath", basePath);
  if (authorsPage) log("Config authorsPath", authorsPath);

  try {
    const wordPressArticles = await graphql(query.wordpress.articles);
    const wordpressAuthors = await graphql(query.wordpress.authors);
    const wordPressTags = await graphql(query.wordpress.tags);
    const wordPressPages = await graphql(query.wordpress.pages);
    const siteMetaDataInfo = await graphql(query.wordpress.siteMetadata);

    dataSources.wordPress.articles = wordPressArticles.data.articles.edges.map(
      normalize.wordPress.articles
    );

    dataSources.wordPress.pages = wordPressPages.data.pages.edges.map(
      normalize.wordPress.articles
    );

    dataSources.wordPress.authors = wordpressAuthors.data.authors.edges.map(
      (author) => author.node
    );

    dataSources.wordPress.tags = wordPressTags.data.tags.edges.map(
      (tag) => tag.node
    );

    apiUrl = siteMetaDataInfo.data.site.siteMetadata.apiUrl;
  } catch (error) {
    console.log(error);
  }

  // Combining together all the articles from different sources
  articles = [...dataSources.wordPress.articles];

  authors = [...dataSources.wordPress.authors];

  tags = [...dataSources.wordPress.tags];

  pages = [...dataSources.wordPress.pages];

  const articlesThatArentSecret = articles.filter((article) => !article.secret);

  log("Creating", "articles page");
  createPaginatedPages({
    edges: articles,
    pathPrefix: basePath,
    createPage,
    pageLength,
    pageTemplate: templates.articles,
    buildPath: buildPaginatedPath,
    context: {
      // authors,
      basePath,
      skip: pageLength,
      limit: pageLength,
    },
  });

  // /**
  //  * Once the list of articles have bene created, we need to make individual article posts.
  //  * To do this, we need to find the corresponding authors since we allow for co-authors.
  //  */
  articles.forEach((article, index) => {
    //   /**
    //    * We need a way to find the next artiles to suggest at the bottom of the articles page.
    //    * To accomplish this there is some special logic surrounding what to show next.
    //    */
    let next = articles.slice(index + 1, index + 3);
    // If it's the last item in the list, there will be no articles. So grab the first 2
    if (next.length === 0) next = articlesThatArentSecret.slice(0, 2);
    // If there's 1 item in the list, grab the first article
    if (next.length === 1 && articlesThatArentSecret.length !== 2)
      next = [...next, articlesThatArentSecret[0]];
    if (articles.length === 1) next = [];

    createPage({
      path: article.slug,
      component: templates.article,
      context: {
        article,
        // authors: authorsThatWroteTheArticle,
        basePath,
        permalink: `${data.site.siteMetadata.siteUrl}${article.slug}/`,
        slug: article.slug,
        id: article.id,
        title: article.title,
        canonicalUrl: article.canonical_url,
        mailchimp,
        next,
      },
    });
  });

  // // Generation of Amp Pages

  articles.forEach((article) => {
    createPage({
      path: `${article.slug}amp`,
      component: templates.ampPage,
      context: {
        slug: article.slug,
        amp: true,
      },
    });
  });

  // // Genration of pages

  pages.forEach((article, index) => {
    //   /**
    //    * We need a way to find the next artiles to suggest at the bottom of the articles page.
    //    * To accomplish this there is some special logic surrounding what to show next.
    //    */
    createPage({
      path: article.slug,
      component: templates.page,
      context: {
        article,
        basePath,
        permalink: `${data.site.siteMetadata.siteUrl}${article.slug}/`,
        slug: article.slug,
        id: article.id,
        title: article.title,
        canonicalUrl: article.canonical_url,
      },
    });
  });

  // /**
  //  * By default the author's page is not enabled. This can be enabled through the theme options.
  //  * If enabled, each author will get their own page and a list of the articles they have written.
  //  */
  // if (authorsPage) {
  //   log('Creating', 'authors page');
  // }

  // Authors Pages builder

  authors.forEach((author) => {
    const articlesTheAuthorHasWritten = articles.filter(
      (article) =>
        article.author.name.toLowerCase() === author.name.toLowerCase()
    );

    const path = slugify(author.slug, authorsPath);

    createPaginatedPages({
      edges: articlesTheAuthorHasWritten,
      pathPrefix: "author/" + author.slug,
      createPage,
      pageLength,
      pageTemplate: templates.author,
      buildPath: buildPaginatedPath,
      context: {
        author: author,
        originalPath: path,
        // originalPath: author.slug,
        skip: pageLength,
        limit: pageLength,
      },
    });
  });

  const articlesWithFlatTagNames = articles.map((article) => ({
    ...article,
    flatTags: [...article.tags.map((tag) => tag.slug)],
  }));

  tags.forEach((tag) => {
    const articlesWithTag = articlesWithFlatTagNames.filter((article) =>
      article.flatTags.includes(tag.slug)
    );

    const path = slugify(tag.slug, "/tags");

    createPaginatedPages({
      edges: articlesWithTag,
      pathPrefix: "tag/" + tag.slug,
      createPage,
      pageLength,
      pageTemplate: templates.tag,
      buildPath: buildPaginatedPath,
      context: {
        tag: tag,
        originalPath: path,
        // originalPath: author.slug,
        skip: pageLength,
        limit: pageLength,
      },
    });
  });
};
