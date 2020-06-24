/* eslint-disable */

/**
 * In order to improve the authoring experience we'll set a fallback for hero images
 * when they're not provided. This will allow you to write articles without immediately
 * adding a hero image.
 *
 * @param {Object} heroSource
 */
function normalizeHero(article) {
  let hero = {
    full: {},
    regular: {},
    narrow: {},
    seo: {},
  };

  if (
    article.hero &&
    article.hero.localFile &&
    article.hero.localFile.full &&
    article.hero.localFile.narrow &&
    article.hero.localFile.seo
  ) {
    hero = {
      full: article.hero.localFile.full.fluid,
      regular: article.hero.localFile.regular.fluid,
      narrow: article.hero.localFile.narrow.fluid,
      seo: article.hero.localFile.seo.fixed,
    };
  } else {
    console.log("\u001B[33m", `Missing hero for "${article.title}"`);
  }

  return hero;
}

function normalizeAvatar(author) {
  let avatar = {
    small: {},
    medium: {},
    large: {},
  };

  if (author.avatar) {
    avatar = {
      small: author.avatar.small.fluid,
      medium: author.avatar.medium.fluid,
      large: author.avatar.large.fluid,
    };
  } else {
    console.log("\u001B[33m", `Missing avatar for "${author.name}"`);
  }

  return avatar;
}

module.exports.wordPress = {
  articles: ({ node: article }) => {
    return {
      ...article,
      hero: normalizeHero(article),
    };
  },
  authors: ({ node: author }) => {
    return {
      ...author,
      avatar: normalizeAvatar(author),
    };
  },
};
