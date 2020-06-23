import React from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import url from "url";
import { globalHistory } from "@reach/router";
import { IArticle } from "types";

const capitalize = (str: String) => {
  if (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  } else {
    return "";
  }
};

type ArticleMetaProps = {
  data: IArticle;
  amp: boolean;
};

type SeoData = {
  wpSiteMetaData: {
    name: string;
    description: string;
  };
  site: {
    siteMetadata: {
      siteUrl: string;
    };
  };
};

const ArticleMeta: React.FC<ArticleMetaProps> = ({ data, amp }) => {
  const queryData = useStaticQuery<SeoData>(graphql`
    query {
      wpSiteMetaData {
        name: siteName
        description: siteDescription
        language: language
      }
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);
  const {
    wpSiteMetaData: { name },
  } = queryData;
  const baseUrl = queryData.site.siteMetadata.siteUrl;
  const canonicalUrl = url.resolve(baseUrl, globalHistory.location.pathname);

  console.log(data.hero, "hero is here");

  const feature_image = data.hero?.seo?.src;

  return (
    <>
      <Helmet>
        <title>{`${name} | ${capitalize(data.title)}`}</title>
        {!amp && <link rel="ampHtml" href={`${canonicalUrl}amp`} />}
        <meta name="description" content={data.excerpt} />
        {!amp && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:site_name" content={name} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`${name} | ${capitalize(data.title)}`}
        />
        <meta property="og:description" content={data.excerpt} />
        <meta property="og:url" content={canonicalUrl} />
        {feature_image && <meta property="og:image" content={feature_image} />}
        <meta
          name="twitter:title"
          content={`${name} | ${capitalize(data.title)}`}
        />
        <meta name="twitter:description" content={data.excerpt} />
        <meta name="twitter:url" content={canonicalUrl} />
        {feature_image && (
          <meta name="twitter:card" content="summary_large_image" />
        )}
        {feature_image && <meta name="twitter:image" content={feature_image} />}
      </Helmet>
    </>
  );
};

export default ArticleMeta;
