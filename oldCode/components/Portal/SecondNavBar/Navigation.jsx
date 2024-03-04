import React, { useState } from "react";
import {
  NavbarContainer,
  LeftContainer,
  RightContainer,
  NavbarExtendedContainer,
  NavbarInnerContainer,
  NavbarLinkContainer,
  NavbarLink,
  Logo,
  OpenLinksButton,
  NavbarLinkExtended,
} from "./Navigation.styled.js";
import LogoImg from "./Assets/logo.svg";
import dashboard from "./Assets/dashboard.svg";
import physicalMaping from "./Assets/physicalMaping.svg";
import ims from "./Assets/ims.svg";
import inventry from "./Assets/inventry.svg";
import monitering from "./Assets/monitering.svg";
import ipam from "./Assets/ipam.svg";
import dcm from "./Assets/dcm.svg";
import auto from "./Assets/auto.svg";
import blocks from "./Assets/blocks.svg";

const Navigation = () => {
  const [extendNavbar, setExtendNavbar] = useState(false);
  return (
    <div>
      <NavbarContainer extendNavbar={extendNavbar}>
        <NavbarInnerContainer>
          <LeftContainer>
            <NavbarLinkContainer>
              <NavbarLink to="/" activeStyle>
                <img
                  src={dashboard}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Dashboard
              </NavbarLink>
              <NavbarLink to="/physical-mapping" activeStyle>
                <img
                  src={physicalMaping}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Physical Mapping
              </NavbarLink>
              <NavbarLink to="/ims" activeStyle>
                <img
                  src={ims}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                    // fill: "#000",
                  }}
                />
                IMS
              </NavbarLink>
              <NavbarLink to="/inventry" activeStyle>
                <img
                  src={inventry}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Inventry
              </NavbarLink>
              <NavbarLink to="/monitering" activeStyle>
                <img
                  src={monitering}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Monitering
              </NavbarLink>

              <NavbarLink to="/auto-discovery" activeStyle>
                <img
                  src={auto}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                Auto Discovery
              </NavbarLink>
              <NavbarLink to="/ipam" activeStyle>
                <img
                  src={ipam}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                IPAM
              </NavbarLink>
              <NavbarLink to="/dcm" activeStyle>
                <img
                  src={dcm}
                  alt=""
                  style={{
                    marginRight: "10px",
                    marginBottom: "5px",
                    width: "20px",
                    height: "20px",
                  }}
                />
                DCCM
              </NavbarLink>
              <OpenLinksButton
                onClick={() => {
                  setExtendNavbar((curr) => !curr);
                }}
              >
                {extendNavbar ? <>&#10005;</> : <> &#8801;</>}
              </OpenLinksButton>
            </NavbarLinkContainer>
          </LeftContainer>
          <RightContainer>
            {/* <Logo src={LogoImg} style={{ width: "150px" }}></Logo> */}
            <button
              style={{
                width: "135px",
                background:
                  "linear-gradient(270deg, #3C9E35 0%, #6FB525 108.27%)",
                borderRadius: "5px",

                outline: "none",
                overflow: "none",
                border: "0px",
                margin: "5px",
                alignItems: "center",
                textAlign: "center",
                fontSize: "14px",
                color: "white",
                cursor: "pointer",
              }}
            >
              <img src={blocks} alt="" style={{ margin: "auto" }} /> Add Widgets
            </button>
          </RightContainer>
        </NavbarInnerContainer>
        {extendNavbar && (
          <NavbarExtendedContainer>
            <NavbarLinkExtended to="/"> Dashboard</NavbarLinkExtended>
            <NavbarLinkExtended to="/physical-mapping">
              Physical Mapping
            </NavbarLinkExtended>
            <NavbarLinkExtended to="/ims"> IMS</NavbarLinkExtended>
            <NavbarLinkExtended to="/inventry"> Inventry</NavbarLinkExtended>
            <NavbarLinkExtended to="/monitering">Monitering</NavbarLinkExtended>
            <NavbarLinkExtended to="/auto-discovery">
              Auto Discovery
            </NavbarLinkExtended>
            <NavbarLinkExtended to="/ipam">IPAM</NavbarLinkExtended>
            <NavbarLinkExtended to="/dcm">DCCM</NavbarLinkExtended>
          </NavbarExtendedContainer>
        )}
      </NavbarContainer>
    </div>
  );
};

export default Navigation;
