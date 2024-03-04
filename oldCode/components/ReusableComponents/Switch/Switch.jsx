import React, { useContext, useState } from "react";
import { SwitchStyle } from "./Switch.style";
import { MoonIcon, SunIcon } from "../../../svg";
import { CreateThemeContext } from "../../../context/ThemeContext";

function Switch() {
  const { isColorActive, setColorActive } = useContext(CreateThemeContext);
  const [isButtonSwitch, setButtonSwitch] = useState(false);

  const handleSwitch = () => {
    setButtonSwitch(!isButtonSwitch);
    setColorActive(!isColorActive);
  };

  return (
    <SwitchStyle onClick={handleSwitch}>
      <article className="toggle-button">
        {isButtonSwitch ? <SunIcon /> : <MoonIcon />}
      </article>
    </SwitchStyle>
  );
}

export default Switch;
