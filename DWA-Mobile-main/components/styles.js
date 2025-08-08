import styled from "styled-components";
import { View } from "react-native";
//colors
export const Colors = {
  primary: "#213E64",
  secondary: "#649A47",
  tertiary: "#D54128",
  fourth: "#0064B6",
};

const { primary, secondary, tertiary, fourth } = Colors;

export const StyledContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
`;

export const InnerContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const StyledFormArea = styled.View`
  width: 100%;
`;
export const TextLink = styled.TouchableOpacity`
  margin-top: 10px;
`;

export const TextLinkContent = styled.Text`
  color: #0056b3;
  font-size: 14px;
  font-weight: bold;
  text-decoration-line: underline;
`;
