import React, { useState } from "react";

import AtomNav from "../AtomNavigation";
import Atom from "../Atom";
import PassGroup from "../PasswordGroup";

const index = () => {
  const [pageName, setPageName] = useState("Atom");
  const showTable = (myPageTable) => {
    if (myPageTable === "Atom") {
      setPageName(myPageTable);
    } else if (myPageTable === "Password Group") {
      setPageName("Password Group");
    }
  };

  return <div></div>;
};

export default index;
