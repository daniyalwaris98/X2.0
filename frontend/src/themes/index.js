import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    background: {
      default: "#F6F6F6", // default ligt gray
    },

    color: {
      default: "#ACACAC", // profile picture background
      main: "#FFFFFF", // table background white
      primary: "#3D9E47", // montex green
      secondary: "#ACACAC", // search icons gray
      tertiary: "#E4F1E5", // left menu item background light green
      success: "#66B127", // success color parrot green
      info: "#F1B92A", //yellow
      danger: "#E34444", //danger color red
      disable: "#5A5A5A", // gray
      checkboxBorder: "#DBDBDB",
      modalTitle: "#EBEBEB", // light blue
      inputBorderColor: "#F5F5F5",
      textBlackColor:"#262626", //text color black
    },

    textColor: {
      default: "#000000", // black
      main: "#FFFFFF", // white
      primary: "#D9D9D9", // montex green
      secondary: "#D9D9D9", // silver
      tertiary: "#5C5C5C", // grey
      tableText: "#262626",
      danger: "#E34444", //danger color red
      input: "#7F7F7F",
    },
  },

  typography: {
    fontFamily: "Arial, sans-serif",

    textSize: {
      small: "12px",
      medium: "14px",
      large: "16px",
      extraLarge: "",
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    background: {
      default: "#131B15", // dark mode background color
    },

    color: {
      default: "#595959", // profile picture background
      main: "#000000", // table background dark gray
      primary: "#3D9E47", // montex green
      secondary: "#ACACAC", // search icons gray
      tertiary: "#C8EF9E", // left menu item background light green
      success: "#66B127", // success color parrot green
      info: "#F1B92A", //yellow
      danger: "#E34444", //danger color red
      disable: "#5A5A5A", // gray
      checkboxBorder: "#DBDBDB",
      modalTitle: "#EBEBEB", // light blue
      inputBorderColor: "#F5F5F5",
    },

    textColor: {
      default: "#FFFFFF", // white
      main: "#FFFFFF", // white
      primary: "#D9D9D9", // montex green
      secondary: "#595959", // silver
      tertiary: "#5C5C5C", // grey
      tableText: "#262626",
      danger: "#E34444", //danger color red
      tableText: "#ACACAC",
      input: "#7F7F7F",
    },
  },

  typography: {
    fontFamily: "Arial, sans-serif",

    textSize: {
      small: "12px",
      medium: "14px",
      large: "16px",
      extraLarge: "18px",
    },

    fontWeight: {
      thin: 100,
      normal: 400,
      bold: 700,
    },
  },
});
