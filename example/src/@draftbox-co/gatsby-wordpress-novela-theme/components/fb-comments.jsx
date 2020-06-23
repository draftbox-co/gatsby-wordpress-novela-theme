import React from "react";
import { FacebookProvider, Comments } from "../../gatsby-wordpress-novela-theme/src/react-facebook";

const FbComments = (props) => {
  return process.env.GATSBY_FB_APP_ID ? (
    <FacebookProvider appId={process.env.GATSBY_FB_APP_ID}>
      <Comments width={"100%"} href={props.href} />
    </FacebookProvider>
  ) : (
    <></>
  );
};
export default FbComments;
