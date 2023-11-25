import React from "react";
import { useTheme } from "@mui/material/styles";
import DefaultButton, { DropDownButton } from "./buttons";
import { Typography } from "@mui/material";
import useButtonGenerator from "../hooks/useButtonGenerator";

export default function PageHeader({ pageName, buttons, selectedRowKeys }) {
  const theme = useTheme();
  const buttonGenerator = useButtonGenerator();

  // const renderButton = (buttonNamePostfix, button) => {
  //   const {
  //     type,
  //     icon,
  //     handleClick,
  //     sx,
  //     text = true,
  //     selection = false,
  //     postfix = false,
  //     options,
  //   } = button;
  //   // let sx = getStylesByType(type, options);
  //   if (options) {
  //     return (
  //       <DropDownButton
  //         key={type}
  //         handleClick={handleClick}
  //         sx={sx}
  //         options={options}
  //       >
  //         {icon}
  //         {text ? (postfix ? `${type} ${buttonNamePostfix}` : type) : null}
  //       </DropDownButton>
  //     );
  //   } else {
  //     return (
  //       <>
  //         {selection ? (
  //           selectedRowKeys && selectedRowKeys.length > 0 ? (
  //             <DefaultButton key={type} handleClick={handleClick} sx={sx}>
  //               {icon}
  //               {text
  //                 ? postfix
  //                   ? `${type} ${buttonNamePostfix}`
  //                   : type
  //                 : null}
  //             </DefaultButton>
  //           ) : null
  //         ) : (
  //           <DefaultButton key={type} handleClick={handleClick} sx={sx}>
  //             {icon}
  //             {text ? (postfix ? `${type} ${buttonNamePostfix}` : type) : null}
  //           </DefaultButton>
  //         )}
  //       </>
  //     );
  //   }
  // };

  return (
    <div style={{ padding: "10px" }}>
      <Typography
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ color: theme?.palette?.page_header?.primary_text }}>
          {pageName}
        </Typography>

        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {buttons.map((button) => {
            return buttonGenerator(button);
          })}
        </Typography>
      </Typography>
    </div>
  );
}
