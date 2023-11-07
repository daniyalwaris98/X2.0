import React from "react";
import AtomModule from "../containers/atomModule";
import Atom from "../containers/atomModule/atom";
import PasswordGroup from "../containers/atomModule/passwordGroup";

const routes = {
  path: "atom_module",
  element: <AtomModule />,
  children: [
    {
      path: "atom",
      element: <Atom />,
    },
    {
      path: "password_group",
      element: <PasswordGroup />,
    },
  ],
};

export default routes;
