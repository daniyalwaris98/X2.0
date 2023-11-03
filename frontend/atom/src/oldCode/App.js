import React, { useEffect, useState, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "antd/dist/antd.min.css";
import theme from "./styles/theme";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import tEn from "./components/Languages/English/Eng.json";
import tDu from "./components/Languages/Dutch/Du.json";
import Loader from "./components/Loader/Loader";
import ChatBot from "./components/Dashboard/bot/ChatBot";
import { ThemeProvider } from "styled-components";
import "./App.css";
const NavBar = React.lazy(() => import("./components/NavBar"));
import AutoDiscovery from "./containers/AutoDiscovery";
// import ManageNetworks from "./containers/AutoDiscovery/ManageNetworks";

import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

import { GlobalStyle } from "./styles/GlobalStyle";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: tEn,
      },
      DE: {
        translation: tDu,
      },
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

function App() {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem("lang"));
  useEffect(() => {
    //  let language=;
    setCurrentLang(currentLang);
    i18n.changeLanguage(currentLang);
  }, [currentLang]);

  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loader />}>
        <GlobalStyle />
        {/* <Routes>
          <Route path="/" exact element={<Atom />} />
          <Route path="/login" exact element={<Login />} />
        </Routes> */}

        <NavBar i18n={i18n} />
        <Routes>
          <Route path="/auto-discovery" exact element={<AutoDiscovery />} />
          {/* <Route path="/manage-networks" exact element={<ManageNetworks />} /> */}
        </Routes>

        <ChatBot />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
