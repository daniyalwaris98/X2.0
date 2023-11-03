import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

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
  align-items: center;
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
`;

export const NavbarLink = styled(Link)`
  color: #878787;
  font-size: 14px;
  justify-content: center;
  text-decoration: none;
  margin: 5px;
  font-weight: 600;
  color: ${(props) => (props.mainLoc ? "#66B127 !important" : "#878787")};
  border-bottom: ${(props) =>
    props.mainLoc ? "2px solid #71b626 !important" : null};

  font-weight: ${(props) => (props.mainLoc ? 700 : 500)};

  &:hover {
    color: #71b626;
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
