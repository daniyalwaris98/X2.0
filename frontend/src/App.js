import * as React from "react";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
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
    <>
      <div
        className="relative"
        style={{
          backgroundColor: theme.palette.background.default,
          height: "100vh",
          width: "100%",
          // paddingTop: "100px",
        }}
      >
        <Button
          onClick={toggleTheme}
          variant="contained"
          sx={{
            backgroundColor: theme.palette.color.primary,
            color: theme.palette.color.main,
            // position: "absolute",
            // right: "0",
          }}
        >
          change Theme
        </Button>

        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </Provider>
      </div>
    </>
  );
};

export default App;
