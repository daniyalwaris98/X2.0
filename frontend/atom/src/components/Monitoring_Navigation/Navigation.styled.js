import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { FlexboxStyle } from "../../styles/commonStyle";

export const NavbarContainer = styled.nav`
  width: 100%;
  height: ${(props) => (props.extendNavbar ? "100vh" : "35px")};
  display: flex;
  flex-direction: column;
`;

export const LeftContainer = styled.div`
  flex: 80%;
  display: flex;
  align-items: center;
  padding-left: 2%;
`;
export const CenterContainer = styled.div`
  text-align: center;

  width: 100%;
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
`;
export const SubNavbarLink = styled(Link)`
  font-size: 14px;
  justify-content: center;
  padding: 10px;
  color: ${(props) =>
    props.mainLoc ? "#66B127 !important" : "rgba(0,0,0,0.5) !important"};
  border-bottom: ${(props) =>
    props.mainLoc ? "2px solid #71b626 !important" : null};

  text-decoration: none;
  margin: 5px;
  font-weight: 600;

  &:hover {
    color: #71b626;
  }
`;

export const SubMenuLink = styled(Link)`
  ${FlexboxStyle({ gap: "10px" })};

  font-size: 14px;
  padding: 10px;
  color: ${(props) =>
    props.mainLoc ? "#66B127 !important" : "rgba(0,0,0,0.5) !important"};
  border-bottom: ${(props) =>
    props.mainLoc ? "2px solid #71b626 !important" : null};
  list-style-type: none;
  text-decoration: none;
  font-weight: 600;
  list-style: none;

  &::marker {
    display: none;
  }

  &:hover {
    color: #71b626 !important;
    border-bottom: 2px solid #71b626;
  }

  .icon {
    ${FlexboxStyle({ justify: "center" })};

    > svg {
      width: 20px;
    }
  }
`;

export const NavbarLink = styled(Link)`
  ${FlexboxStyle({ gap: "10px" })};

  color: #878787;
  font-size: 14px;

  text-decoration: none;
  margin: 5px;
  font-weight: 600;
  color: ${(props) =>
    props.mainLoc ? "#66B127 !important" : "rgba(0,0,0,0.5) !important"};
  border-bottom: ${(props) =>
    props.mainLoc ? "2px solid #71b626 !important" : null};

  &:hover {
    color: #71b626;
  }

  .icon {
    ${FlexboxStyle};

    > svg {
      width: 20px;
      fill: none;
      stroke: ${({ theme }) => theme.colors.PRIMARY_COLOR};
    }
  }
`;

export const NavbarLinkExtended = styled(Link)`
  color: #c5c5c5;
  font-size: 12px;
  text-decoration: none;
  margin: 10px;
`;

export const Logo = styled.img`
  margin: 10px;
  max-width: 180px;
  height: auto;
`;

export const OpenLinksButton = styled.button`
  width: 70px;
  height: 35px;
  background: none;
  border: none;
  color: white;
  font-size: 45px;
  cursor: pointer;
  display: none;
`;

export const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #2d2f35;
`;
