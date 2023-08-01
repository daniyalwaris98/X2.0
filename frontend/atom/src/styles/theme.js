const constantColors = {
  PRIMARY_COLOR: "#66B127",
  SECONDARY_COLOR: "#6C6B75",
  WHITE_COLOR: "#fff",
  DARK_PRIMARY_COLOR: "#5da323",
  LIGHTEST_GRAY_COLOR: "#F6F6F6",
  DARK_COLOR: "#263238",
  GRAY_COLOR: "#949494",
  RED_COLOR: "#ff0000",
};

const breakPoints = {
  smallDevices: "425px",
  mobile: "600px",
  mediumDevices: "768px",
  tablets: "900px",
  largeDevices: "1024px",
  desktop: "1200px",
};

const theme = {
  colors: {
    PRIMARY_COLOR: "#66B127",
    SECONDARY_COLOR: "#6C6B75",
    LIGHT_PRIMARY_COLOR: "#F1FFE1",
    LIGHT_SECONDARY_COLOR: "#fdfdfd",
    DARK_PRIMARY_COLOR: "#5da323",
    LIGHTEST_GRAY_COLOR: "#F6F6F6",
    SILVER_COLOR: "#e3e3e3",
    PLANTINUM_COLOR: "#ACACAC",
    GRAY_COLOR: "#C5C5C5",
    DARK_COLOR: "#263238",
    DIM_GRAY_COLOR: "#6C6B75",
    DARK_GRAY_COLOR: "#e0e0e0",
    BLACK_COLOR: "#000000",
    RED_COLOR: "#ff0000",
    DULL_WHITE_COLOR: "#FDFDFD;",
    TOMATO_COLOR: "#FB7457",
    WHITE_COLOR: "#fff",
  },

  lightMode: {
    colors: {
      FONT_COLOR: "#000",
      FONT_COLOR_REVERSE: "#313131",
      BACKGROUND_COLOR: "#fff",
      BORDER_COLOR: "#ACACAC",
      LIGHT_BACKGROUND_COLOR: "#F6F6F6",
      ...constantColors,
    },

    gradients: {
      PRIMARY_GRADIENT:
        "conic-gradient(from -29.1deg at 55.53% 60.23%, #3a9c47 -34.02deg, #6eb444 192.93deg,#3a9c47 325.98deg,#6eb444 552.93deg);",
    },

    breakPoints,
  },

  darkMode: {
    colors: {
      FONT_COLOR: "#DBDBDB",
      FONT_COLOR_REVERSE: "#ACACAC",
      BACKGROUND_COLOR: "#131B15",
      BORDER_COLOR: "#7D7D7D",
      LIGHT_BACKGROUND_COLOR: "#262626",
      ...constantColors,
    },

    gradients: {
      PRIMARY_GRADIENT:
        "conic-gradient(from -29.1deg at 55.53% 60.23%, #161E18 -34.02deg, #191D1A 192.93deg, #161E18 325.98deg, #191D1A 552.93deg);",
    },

    breakPoints,
  },
};

export default theme;
