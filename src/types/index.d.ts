import React from "react";

export interface IPaginator {
  pageCount: number;
  index: number;
  pathPrefix: string;
}

interface IGatsbyImage {
  src: string;
  base64?: string;
  srcWebp?: string;
  srcSet?: string;
  srcSetWebp?: string;
  tracedSVG?: string;
}

interface IGatsbyImageFluid extends IGatsbyImage {
  maxHeight: number;
  maxWidth: number;
}

interface IGatsbyImageFixed extends IGatsbyImage {
  height: number;
  width: number;
}

// export interface IAuthor {
//   authorsPage?: boolean;
//   featured?: boolean;
//   name: string;
//   slug: string;
//   bio: string;
//   avatar: {
//     image: IGatsbyImageFluid;
//     full: IGatsbyImageFluid;
//   };
// }

export interface IAuthor {
  name: string;
  slug: string;
  bio: string;
  avatar_urls: {
    wordpress_96: string;
  };
}

export interface ITag {
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface IArticle {
  title: string;
  body: string;
  featured: boolean;
  published_at: string;
  updated_at: string;
  slug: string;
  author: IAuthor;
  tags: ITag[];
  excerpt: string;
  id: string;
  featured_media_custom: {
    localFile: {
      publicURL: string;
    };
  };
  hero: {
    full: IGatsbyImageFluid;
    preview: IGatsbyImageFluid;
    regular: IGatsbyImageFluid;
    seo: {
      src: string;
    };
  };
  readingTime: string;
  date: string;
  modified: string;
  seoDate: string;
  seoModifiedDate: string;
}

interface IArticleQuery {
  edges: {
    node: IArticle;
  }[];
}

export interface IProgress {
  height: number;
  offset: number;
  title: string;
  mode: string;
  onClose?: () => void;
}

export type Icon = React.FC<{
  fill: string;
}>;

export type Template = React.FC<{
  pageContext: {
    article: IArticle;
    authors: IAuthor[];
    mailchimp: boolean;
    next: IArticle[];
  };
  location: Location;
}>;
