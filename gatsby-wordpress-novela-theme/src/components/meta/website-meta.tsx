import React from "react";
import Helmet from "react-helmet";
import { graphql, useStaticQuery } from "gatsby";
import url from "url";
import { globalHistory } from "@reach/router";

type SeoData = {
  site: {
    siteMetadata: {
      siteUrl: string;
      siteTitle: string;
      siteDescription: string;
      metadata: {
        title: string;
        description: string;
      };
      twitterCard: {
        title: string;
        description: string;
        imageUrl: string;
        username: string;
      };
      facebookCard: {
        title: string;
        description: string;
        imageUrl: string;
        appId: string;
      };
      language: string;
      logoUrl: string;
      iconUrl: string;
      coverUrl: string;
      alternateLogoUrl: string;
      shareImageHeight: string;
      shareImageWidth: string;
    };
  };
};

const WebsiteMeta = () => {
  const data = useStaticQuery<SeoData>(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
          siteTitle
          metadata {
            title
            description
          }
          twitterCard {
            title
            description
            imageUrl
            username
          }
          facebookCard {
            title
            description
            imageUrl
            appId
          }
          siteDescription
          language
          logoUrl
          iconUrl
          coverUrl
          alternateLogoUrl
          shareImageWidth
          shareImageHeight
        }
      }
    }
  `);

  const config = data.site.siteMetadata;

  const baseUrl = data.site.siteMetadata.siteUrl;
  const siteTitle = data.site.siteMetadata.siteTitle;
  const siteDescription = data.site.siteMetadata.siteDescription;

  const canonical = url.resolve(baseUrl, globalHistory.location.pathname);

  const description = config.metadata.description || config.siteDescription;

  const publisherLogo = url.resolve(
    config.siteUrl,
    config.logoUrl || config.alternateLogoUrl
  );
  let shareImage =
    config.coverUrl ||
    config.facebookCard.imageUrl ||
    config.twitterCard.imageUrl;

  shareImage = shareImage ? url.resolve(config.siteUrl, shareImage) : null;

  const facebookImageUrl = config.facebookCard.imageUrl
    ? url.resolve(config.siteUrl, config.facebookCard.imageUrl)
    : null;

  const twitterImageUrl = config.twitterCard.imageUrl
    ? url.resolve(config.siteUrl, config.twitterCard.imageUrl)
    : null;

  const jsonLd = {
    "@context": `https://schema.org/`,
    "@type": "Website",
    url: canonical,
    image: shareImage
      ? {
          "@type": `ImageObject`,
          url: shareImage,
          width: config.shareImageWidth,
          height: config.shareImageHeight,
        }
      : undefined,
    publisher: {
      "@type": `Organization`,
      name: siteTitle,
      logo: {
        "@type": `ImageObject`,
        url: publisherLogo,
        width: 60,
        height: 60,
      },
    },
    mainEntityOfPage: {
      "@type": `WebPage`,
      "@id": config.siteUrl,
    },
    description,
  };

  return (
    <>
      <Helmet htmlAttributes={{ language: config.language }}>
        <title>{config.metadata.title || config.siteTitle}</title>
        <meta
          name="description"
          content={config.metadata.description || config.siteDescription}
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:site_name" content={config.siteTitle} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={
            config.facebookCard.title ||
            config.metadata.title ||
            config.siteTitle
          }
        />
        <meta
          property="og:description"
          content={
            config.facebookCard.description ||
            config.metadata.description ||
            config.siteDescription
          }
        />
        <meta property="og:url" content={canonical} />
        {config.facebookCard.imageUrl !== "" && (
          <meta property="og:image" content={facebookImageUrl} />
        )}
        {config.facebookCard.appId !== "" && (
          <meta property="fb:app_id" content={config.facebookCard.appId} />
        )}
        <meta
          name="twitter:title"
          content={
            config.twitterCard.title ||
            config.metadata.title ||
            config.siteTitle
          }
        />
        <meta
          name="twitter:description"
          content={
            config.twitterCard.description ||
            config.metadata.description ||
            config.siteDescription
          }
        />
        <meta name="twitter:url" content={canonical} />
        {config.twitterCard.username && (
          <meta name="twitter:site" content={config.twitterCard.username} />
        )}
        {config.twitterCard.username && (
          <meta name="twitter:creator" content={config.twitterCard.username} />
        )}
        {config.twitterCard.imageUrl && (
          <meta name="twitter:image" content={twitterImageUrl} />
        )}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd, undefined, 4)}
        </script>
      </Helmet>
    </>
  );
};

export default WebsiteMeta;
