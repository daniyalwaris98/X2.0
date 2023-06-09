import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

export const NavbarContainer = styled.nav`
  width: 100%;
  height: ${(props) => (props.extendNavbar ? "100%" : "35px")};
  display: flex;
  flex-direction: column;
  /* background-color: #000; */
  // @media (min-width: 700px) {
  //   height: 55px;
  // }
`;

// export const LeftContainer = styled.div`
//   flex: 80%;
//   display: flex;
//   align-items: center;
//   padding-left: 2%;
// `;
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

// export const RightContainer = styled.div`
//   flex: 0%;
//   display: flex;
//   justify-content: flex-end;
//   padding-right: 20px;
// `;

export const NavbarInnerContainer = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  background-color: transparent;
  align-item: center;
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
  @media (max-width: 900px) {
    display: none;
  }
  // border-bottom: 2px solid #878787;
`;
export const SubNavbarLink = styled(Link)`
  color: #878787;
  font-size: 14px;
  justify-content: center;
  padding: 10px;

  text-decoration: none;
  margin: 5px;
  font-weight: 600;

  &:hover {
    color: #71b626;
  }
  /* &.active {
    color: #71b626;
  } */
  @media (max-width: 900px) {
    display: none;
  }
`;
export const NavbarLink = styled(Link)`
  color: #878787;
  font-size: 14px;
  justify-content: center;
  // font-family: Arial, Helvetica, sans-serif;
  text-decoration: none;
  margin: 5px;
  font-weight: 600;

  // border-bottom: 1px solid #878787;
  &:hover {
    color: #71b626;
    // font-weight:700;
  }

  // @media (max-width: 900px) {
  //   display: none;
  // }
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

  @media (min-width: 900px) {
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

  @media (min-width: 900px) {
    display: none;
  }
`;
