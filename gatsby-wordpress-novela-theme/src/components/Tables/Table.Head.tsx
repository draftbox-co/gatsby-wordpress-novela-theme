import styled from "@emotion/styled";

const Head = styled.thead`
  text-align: left;
  border-collapse: collapse;
  position: relative;
  line-height: 1.756;
  color: ${p => p.theme.colors.primary};
  font-family: ${p => p.theme.fonts.serif};
  font-weight: var(--merriweather-font-bold);
  transition: ${p => p.theme.colorModeTransition};
`;

export default Head;
