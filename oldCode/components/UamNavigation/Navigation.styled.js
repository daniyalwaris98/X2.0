import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { FlexboxStyle } from "../../styles/commonStyle";

export const NavbarContainer = styled.nav`
  width: 100%;
  height: ${(props) => (props.extendNavbar ? "100%" : "35px")};
  display: flex;
  flex-direction: column;
  // @media (min-width: 700px) {
  //   height: 55px;
  // }
`;

export const LeftContainer = styled.div`
  flex: 80%;
  display: flex;
  align-items: center;
  padding-left: 2%;
`;
export const CenterContainer = styled.div`
  // flex: 80%;
  // justify-content: center;
  // align-items: center;
  text-align: center;

  width: 100%;
  // border: 2px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RightContainer = styled.div`
  flex: 0%;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
`;

export const NavbarInnerContainer = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  background-color: transparent;
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
  // border-bottom: 2px solid #878787;
  @media (max-width: 1080px) {
    display: none;
  }
`;

export const NavbarLink = styled(Link)`
  ${FlexboxStyle({ gap: "10px" })};

  color: #878787;
  font-size: 14px;
  color: ${(props) => (props.mainLoc ? "#66B127 !important" : "#878787")};
  border-bottom: ${(props) =>
    props.mainLoc ? "2px solid #71b626 !important" : null};
  text-decoration: none;
  margin: 5px;
  font-weight: 600;

  &:hover {
    color: #71b626;
  }

  @media (max-width: 800px) {
    //   display: none;
    font-size: 11px;
  }
  @media (max-width: 900px) {
    /* display: none; */
  }
  @media (max-width: 690px) {
    //   display: none;
    font-size: 9px;
  }

  .icon {
    ${FlexboxStyle};

    > svg {
      width: 20px;
      fill: ${({ theme }) => theme.colors.PRIMARY_COLOR};
    }
  }
`;

export const NavbarLinkExtended = styled(Link)`
  color: #c5c5c5;
  font-size: 12px;
  width: 100%;
  color: ${(props) => (props.mainLoc ? "#66B127 !important" : "#c5c5c5")};
  font-weight: ${(props) => (props.mainLoc ? 700 : 500)};
  background-color: ${(props) =>
    props.mainLoc ? "rgba(255,255,255,0.8) !important" : null};
  border-bottom: ${(props) =>
    props.mainLoc ? "2px solid #71b626 !important" : null};
  // font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  letter-spacing: 2px;
  padding: 5px;
  margin: 10px;
`;

export const Logo = styled.img`
  margin: 10px;
  max-width: 180px;
  height: auto;
`;

export const OpenLinksButton = styled.button`
  width: 70px;
  height: 55px;
  background: none;
  border: none;
  color: black;
  font-size: 45px;
  cursor: pointer;
  float: left;

  @media (min-width: 1080px) {
    display: none;
  }
`;

export const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  padding-top: 15px;
  padding-left: 16px;
  padding-right: 40px;
  background-color: #2d2f35;

  @media (min-width: 1080px) {
    display: none;
  }
`;
