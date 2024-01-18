import React, { useState } from "react";
import collapse from "./assets/collapse.svg";
import add from "./assets/add.svg";
import dcm from "./assets/dcm.svg";
import { Row, Col, Input, Button, Checkbox } from "antd";
import { getTitle } from "../../../utils/helpers";
import DefaultCard from "../../../components/cards";
import { toggleModuleView } from "../../../store/features/adminModule/roles";
import { useDispatch } from "react-redux";

function Index({ moduleKey, moduleConfigurations }) {
  const [isActive, setIsActive] = useState(false);
  const dispatch = useDispatch();

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "100%",
        }}
      >
        <DefaultCard
          sx={{
            backgroundColor: "rgba(223, 255, 187)",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              <img src={dcm} alt="" style={{ float: "left" }} />
              &nbsp; &nbsp;
              <h3>{getTitle(moduleKey)}</h3>
            </div>
            {isActive && moduleConfigurations?.view ? (
              <img
                src={collapse}
                onClick={() => setIsActive(false)}
                alt=""
                style={{
                  cursor: "pointer",
                }}
              />
            ) : (
              <img
                src={add}
                onClick={() => setIsActive(true)}
                alt=""
                style={{
                  cursor: "pointer",
                }}
              />
            )}
          </div>
        </DefaultCard>
        {moduleConfigurations.view && isActive ? (
          <DefaultCard sx={{ marginBottom: "10px" }}>
            {Object.keys(moduleConfigurations.pages).map((pageKey) => {
              let pageData = moduleConfigurations.pages[pageKey];
              return (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <img src={dcm} alt="" />
                    &nbsp; &nbsp;
                    <p>{getTitle(pageKey)}</p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <Checkbox
                      checked={pageData.view}
                      onChange={(e) => {
                        pageData.view = e.target.checked;
                      }}
                    />
                    &nbsp; &nbsp; View
                  </div>

                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <Checkbox
                      checked={pageData.read_only}
                      disabled={!pageData.view}
                      onChange={(e) => {
                        pageData.read_only = e.target.checked;
                      }}
                    />
                    &nbsp; &nbsp; Read Only
                  </div>
                </div>
              );
            })}
          </DefaultCard>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "30%",
          padding: "15px",
        }}
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <Checkbox
            checked={moduleConfigurations.view}
            onChange={(e) => {
              dispatch(toggleModuleView(moduleKey));
              console.log("e.target.checked", e.target.checked);
            }}
          />
          &nbsp; &nbsp; View Module
        </div>
      </div>
    </div>
  );
}

export default Index;
