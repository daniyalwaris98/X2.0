import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    background: {
      default: "#F6F6F6", // default ligt gray
    },

    main_layout: {
      background: "#FFFFFF",
      profile_picture_background: "#ACACAC", // profile picture background
      primary_text: "#000000",
      secondary_text: "#ACACAC",
      border_bottom: "#D9D9D9",
    },

    default_card: {
      background: "#FFFFFF",
    },

    horizontal_menu: {
      primary_text: "#000000",
      secondary_text: "#3D9E47",
    },

    default_table: {
      header_row: "#FAFAFA",
      odd_row: "#FFFFFF",
      even_row: "#FAFAFA",
      selected_row: "#F1F6EE",
      search_icon: "#ACACAC",
      heading_text: "#262626",
      primary_text: "#262626",
      secondary_text: "#3E9F48",
      link_text: "#3E9F48",
      border: "#EBEBEB",
      check_box_border: "#EBEBEB",
      delete_icon: "#262626",
      edit_icon: "#262626",
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
      textBlackColor: "#262626", //text color black
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

    main_layout: {
      background: "#09120C",
      profile_picture_background: "#ACACAC", // profile picture background
      primary_text: "#FFFFFF",
      secondary_text: "#ACACAC",
      border_bottom: "#09120C",
    },

    default_card: {
      background: "#09120C",
    },

    horizontal_menu: {
      primary_text: "#FFFFFF",
      secondary_text: "#3D9E47",
    },

    default_table: {
      header_row: "#3A403C",
      odd_row: "#09120C",
      even_row: "#3A403C",
      selected_row: "#5A5A5A",
      search_icon: "#ACACAC",
      heading_text: "#FFFFFF",
      primary_text: "#262626",
      secondary_text: "#3E9F48",
      link_text: "#3E9F48",
      border: "#EBEBEB",
      check_box_border: "#EBEBEB",
      delete_icon: "#262626",
      edit_icon: "#262626",
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
      tertiary: "#FFFFFF", // grey
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
