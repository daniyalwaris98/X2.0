import React, { useState } from "react";
import BarChart from "../Charts/BarChart/index.jsx";
import PieChart from "../Charts/PieChart/index.jsx";
import {
  MainProfileCard,
  ProfileChildMainCard,
  ProfileChildCard,
} from "./GraphLine.styled.js";
import OnBoardDomain from "./OnBoardDomain/index.jsx";
import edn from "../GraphLine/assets/edn.svg";
import ign from "../GraphLine/assets/ign.svg";
import system from "../GraphLine/assets/system.svg";
import itManager from "../GraphLine/assets/itManager.svg";

const GraphLine = () => {
  const [serviceImg, setServiceImg] = useState(null);
  const [serviceValue, setServiceValue] = useState(null);
  const [serviceName, setServiceName] = useState(null);
  return (
    <div>
      <MainProfileCard>
        <ProfileChildMainCard>
          <ProfileChildCard
            style={{ display: "block", flex: "1", padding: "5px" }}
          >
            <h3
              style={{
                color: "#6C6B75",
                borderLeft: "3px solid #6C6B75",
                borderRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                marginLeft: "3px",
                marginTop: "2px",
              }}
            >
              <b>Oboard</b> per <b>month</b>
            </h3>
            <div style={{ marginTop: "15px auto", width: 300 }}>
              <PieChart />
            </div>
          </ProfileChildCard>
          <ProfileChildCard
            style={{ display: "block", flex: "2", padding: "5px" }}
          >
            <h3
              style={{
                color: "#6C6B75",
                borderLeft: "3px solid #6C6B75",
                borderRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                marginLeft: "3px",
                marginTop: "2px",
              }}
            >
              <b>Count</b> Per <b>Function</b>
            </h3>
            <div style={{ marginTop: "15px auto", width: 650 }}>
              <BarChart />
            </div>
          </ProfileChildCard>
          <ProfileChildCard
            style={{
              flex: "1",
              display: "block",
              padding: "5px",
            }}
          >
            <h3
              style={{
                color: "#6C6B75",
                borderLeft: "3px solid #6C6B75",
                borderRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                marginLeft: "3px",
                marginTop: "2px",
                marginBottom: "10px",
              }}
            >
              <b>Oboard</b> per <b>month</b>
            </h3>
            <OnBoardDomain
              // style={{
              //   marginBottom: "15px",
              //   backgroundColor: "#000",
              //   borderRadius: "5px",
              //   padding: "1.5em",
              // }}
              serviceImg={edn}
              serviceValue={97}
              serviceName={"EDN"}
            />
            <OnBoardDomain
              serviceImg={ign}
              serviceValue={7}
              serviceName={"IGN"}
              // style={{
              //   padding: "10px",
              //   paddingBottom: "15px",
              //   paddingTop: "15px",
              // }}
            />
            <OnBoardDomain
              serviceImg={system}
              serviceValue={97}
              serviceName={"SYSTEM"}
            />
            <OnBoardDomain
              serviceImg={itManager}
              serviceValue={90}
              serviceName={"IT MANAGER"}
            />
          </ProfileChildCard>
        </ProfileChildMainCard>
      </MainProfileCard>
    </div>
  );
};

export default GraphLine;
