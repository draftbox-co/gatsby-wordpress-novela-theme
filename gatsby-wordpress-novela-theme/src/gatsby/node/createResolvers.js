module.exports = async ({
  actions,
  cache,
  createNodeId,
  createResolvers,
  store,
  reporter,
}) => {
  const { createNode } = actions;
  console.log("createResolvers called");

  createResolvers({
    Query: {
      wpSiteMetaData: {
        type: `WPSiteMetaData`,
        async resolve(source, args, context, info) {
          let title = "";
          let description = "";
          let language = "auto";
          const metadata = context.nodeModel.getAllNodes({
            type: `wordpress__site_metadata`,
          });
          const wordPressSetting = context.nodeModel.getAllNodes({
            type: `wordpress__wp_settings`,
          });
          if (metadata && metadata.length > 0) {
            title = metadata[0].name;
            description = metadata[0].description;
          }
          if (wordPressSetting && wordPressSetting.length > 0) {
            title = wordPressSetting[0].title;
            description = wordPressSetting[0].description;
            language = wordPressSetting[0].language;
          } else {
            try {
              const response = await fetch(metadata[0].url);
              const responseHTML = await response.text();
              const firstValue = responseHTML.match(
                /(?<=")(?:\\.|[^"\\])*(?=")/
              )[0];
              language = firstValue;
            } catch (error) {
              console.log("fetching html error");
              language = "auto";
            }
          }
          return {
            siteName: title,
            siteDescription: description,
            language: language,
          };
        },
      },
    },
  });
};
