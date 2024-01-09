import * as React from "react";
import { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import { lightTheme, darkTheme } from "./themes";
import router from "./routes";
import { AppContext } from "./context/appContext";
import "./index.css";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  const { isDarkMode } = useContext(AppContext);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <div
      className="relative"
      style={{
        backgroundColor: theme.palette.background.default,
        height: "auto",
        width: "100%",
      }}
    >
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </div>
  );
};

export default App;
