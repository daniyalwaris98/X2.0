import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import first from "./assets/loc.svg";
import second from "./assets/second.svg";
import third from "./assets/third.svg";
import fourth from "./assets/fourth.svg";
import fifth from "./assets/fourth.svg";
import six from "./assets/fifth.svg";
import seven from "./assets/six.svg";
import { Row, Col, Divider } from "antd";

import { DivStyling, HeaderStyle } from "./TopCard.styled.js";
import axios, { baseUrl } from "../../../utils/axios";
import { SpinLoading } from "../../AllStyling/All.styled.js";
import {
  BoardsIcon,
  DeviceIcon,
  LicenseIcon,
  LocationIcon,
  RackIcon,
  SfpsIcon,
  SwitchesIcon,
} from "../../../svg";

const index = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [myCards, setMyCards] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/dashboardCards");
        console.log("dashboardCards", res);
        setMyCards(res.data);
        console.log(myCards);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const Pages = (pageName) => {
    if (pageName === "SITES") {
      navigate("/uam/sites");
    } else if (pageName === "RACKS") {
      navigate("/uam/racks");
    } else if (pageName === "DEVICES") {
      navigate("/uam/devices");
    } else if (pageName === "MODULES") {
      navigate("/uam/module");
    } else if (pageName === "SS") {
      navigate("/uam/stackswitches");
    } else if (pageName === "SFPs") {
      navigate("/uam/sfps");
    } else if (pageName === "LICENSES") {
      navigate("/uam/license");
    } else if (pageName === "APs") {
      navigate("/uam/aps");
    }
  };

  const imgFun = (myimg) => {
    if (myimg === "SITES") {
      return <LocationIcon />;
    } else if (myimg === "RACKS") {
      return <RackIcon />;
    } else if (myimg === "DEVICES") {
      return <DeviceIcon />;
    } else if (myimg === "BOARDS") {
      return <BoardsIcon />;
    } else if (myimg === "MODULES") {
      return <BoardsIcon />;
    } else if (myimg === "SFPs") {
      return <SfpsIcon />;
    } else if (myimg === "LICENSES") {
      return <LicenseIcon />;
    } else if (myimg === "APs") {
      return <SwitchesIcon />;
    } else {
      return <LicenseIcon />;
    }
  };

  return (
    <SpinLoading spinning={loading} tip="Loading...">
      <HeaderStyle>
        {myCards.map((item, index) => {
          return (
            <DivStyling key={index}>
              <article onClick={() => Pages(item.name)} className="tab">
                <span className="icon">{imgFun(item.name)}</span>
                <article>
                  <p>{item.name}</p>
                  <h2>{item.value}</h2>
                </article>
              </article>
            </DivStyling>
          );
        })}
      </HeaderStyle>
    </SpinLoading>
  );
};

export default index;
