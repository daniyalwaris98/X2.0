import * as React from "react";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { lightTheme, darkTheme } from "./themes";
import { Button } from "@mui/material";
import "./index.css";
import router from "./routes";

const App = () => {
  const [isDarkMode, setDarkMode] = useState(false);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <div
        className="relative"
        style={{
          backgroundColor: theme.background,
          height: "100vh",
          width: "100%",
        }}
      >
        <Button
          onClick={toggleTheme}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.color.primary,
            position: "absolute",
            right: "0",
          }}
        >
          change Theme
        </Button>
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
};

export default App;
