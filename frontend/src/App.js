import * as React from "react";
import { useState, useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import { lightTheme, darkTheme } from "./themes";
import { Button } from "@mui/material";
import "./index.css";
import router from "./routes";
import { AppContext } from "./context/appContext";

const App = () => {
  const { isDarkMode } = useContext(AppContext);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <>
      <div
        className="relative"
        style={{
          backgroundColor: theme.palette.background.default,
          height: "100vh",
          width: "100%",
        }}
      >
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
