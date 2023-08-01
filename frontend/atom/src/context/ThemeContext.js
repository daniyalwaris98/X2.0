import React, { createContext, useState } from "react";

export const CreateThemeContext = createContext();

function CustomThemeProvider({ children }) {
  const [isColorActive, setColorActive] = useState(false);

  return (
    <CreateThemeContext.Provider
      value={{
        isColorActive,
        setColorActive,
      }}
    >
      {children}
    </CreateThemeContext.Provider>
  );
}

export default CustomThemeProvider;
