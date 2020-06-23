import React, { useEffect } from "react";
import { Global } from "@emotion/core";
import styled from "@emotion/styled";
import { useColorMode } from "theme-ui";

import NavigationFooter from "@components/Navigation/Navigation.Footer";
import NavigationHeader from "@components/Navigation/Navigation.Header";
import ArticlesContextProvider from "../../sections/articles/Articles.List.Context";

import { globalStyles } from "@styles";
import { ArmadaFormsProvider } from "../../context/form-context";
import { useStaticQuery, graphql } from "gatsby";
import Helmet from "react-helmet";

/**
 * <Layout /> needs to wrap every page as it provides styles, navigation,
 * and the main structure of each page. Within Layout we have the <Container />
 * which hides a lot of the mess we need to create our Desktop and Mobile experiences.
 */
const Layout: React.FC<{}> = ({ children }) => {
  const {
    wpSiteMetaData: { language: lang },
  } = useStaticQuery(graphql`
    {
      wpSiteMetaData {
        language
      }
    }
  `);

  const [colorMode] = useColorMode();

  useEffect(() => {
    parent.postMessage({ theme: colorMode }, "*");
  }, [colorMode]);

  return (
    <ArmadaFormsProvider client={"5ecd130443daff001ff5ac21"}>
      <ArticlesContextProvider>
        <Helmet
          htmlAttributes={{
            lang: lang ? lang : "auto",
          }}
        />
        <Container>
          <Global styles={globalStyles} />
          <NavigationHeader />
          {children}
          <NavigationFooter />
        </Container>
      </ArticlesContextProvider>
    </ArmadaFormsProvider>
  );
};

export default Layout;

const Container = styled.div`
  position: relative;
  background: ${(p) => p.theme.colors.background};
  transition: ${(p) => p.theme.colorModeTransition};
  min-height: 100vh;
`;
