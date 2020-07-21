import React from "react";
import { DiscussionEmbed } from "disqus-react";

const Disqus = (props) => {
  const disqusConfig = {
    shortname: process.env.GATSBY_DISQUS_SHORTNAME,
    identifier: props.slug,
    title: props.slug,
  };

  return process.env.GATSBY_DISQUS_SHORTNAME ? (
    <DiscussionEmbed shortname={disqusConfig.shortname} config={{
      title: disqusConfig.title,
      identifier: disqusConfig.identifier
    }} />
  ) : (
    <></>
  );
};
export default Disqus;
