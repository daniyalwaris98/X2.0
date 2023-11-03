import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { lightTheme, darkTheme } from "./themes";
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
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
