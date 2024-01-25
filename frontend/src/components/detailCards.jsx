import React from "react";
import { useTheme, styled } from "@mui/material/styles";
import DefaultCard from "./cards";
import { getTitle } from "../utils/helpers";
import { ListItemIcon } from "@mui/material";

export default function DefaultDetailCards({
  data,
  icons = null,
  sx,
  children,
  ...rest
}) {
  const theme = useTheme();

  return (
    <DefaultCard
      sx={{
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          height: "90px",
        }}
      >
        {Object.keys(data)?.map((key, index) => {
          // increase the space factor to increase the space between cards
          const spaceFactor = 3;
          const length = Object.keys(data).length;
          const widthToBeDivided = 100 - (length * spaceFactor) / 5;
          const width = widthToBeDivided / length;
          return (
            <div
              style={{
                borderRadius: "7px",
                width: `${width}%`,
                backgroundColor: "#F6F6F6",
              }}
            >
              <div
                style={{
                  margin: "5%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                    }}
                  >
                    {getTitle(key)}
                  </div>
                  <div
                    style={{
                      color: "green",
                      fontWeight: "bolder",
                      fontSize: "23px",
                      marginTop: "10px",
                    }}
                  >
                    {data[key]}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <img src={icons[index]} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DefaultCard>
  );
}
