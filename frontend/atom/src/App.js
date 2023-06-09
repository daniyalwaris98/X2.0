import "./App.css";
import "leaflet/dist/leaflet.css";
// import "antd/dist/antd.css";
import "antd/dist/antd.min.css";
// import NavBar from "./components/NavBar";
import i18n from "i18next";
import React, { useEffect, useState, Suspense } from "react";
import { useTranslation, initReactI18next } from "react-i18next";
import tEn from "./components/Languages/English/Eng.json";
import tDu from "./components/Languages/Dutch/Du.json";
import { SpinLoading } from "./components/AllStyling/All.styled.js";
import Loader from "./components/Loader/Loader";
import ChatBot from "./components/Dashboard/bot/ChatBot";
import { ThemeProvider } from "styled-components";
import theme from "./styles/theme";
const NavBar = React.lazy(() => import("./components/NavBar"));

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
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
  console.warn = () => {};
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loader />}>
        <NavBar i18n={i18n} />
        <ChatBot />
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
