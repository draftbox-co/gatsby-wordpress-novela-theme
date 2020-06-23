import React from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import url from "url";
import { globalHistory } from "@reach/router";
const htmlToText = require("html-to-text");

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

const WebsiteMeta = () => {
  const data = useStaticQuery<SeoData>(graphql`
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
    wpSiteMetaData: { name, description },
  } = data;
  const baseUrl = data.site.siteMetadata.siteUrl;

  const canonicalUrl = url.resolve(baseUrl, globalHistory.location.pathname);

  let plainName = htmlToText.fromString(name);

  return (
    <>
      <Helmet>
        <title>{plainName}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:site_name" content={name} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={name} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={name} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:url" content={canonicalUrl} />
      </Helmet>
    </>
  );
};

export default WebsiteMeta;
