import React from "react";
import styled from "styled-components/native";

// Styled Components
const HeaderContainer = styled.View`
  width: 100%;
  height: 60px;
  background-color: #ffffff; /* Background color for the header */
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.1); /* Optional shadow for depth */
`;

const Logo = styled.Image`
  width: 40px;
  height: 40px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #0056b3; /* Adjust color as needed */
`;

export default function Header({ title, logo }) {
  return (
    <HeaderContainer>
      <Logo source={"./durham-workforce.png"} />
      <Title>{title}</Title>
    </HeaderContainer>
  );
}
