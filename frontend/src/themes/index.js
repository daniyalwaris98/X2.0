import { createTheme } from "@mui/material/styles";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#007BFF",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  // Other theme configurations
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  // Other theme configurations for dark mode
});
