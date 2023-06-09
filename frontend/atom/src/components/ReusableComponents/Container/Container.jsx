import React from "react";
import { ContainerStyle } from "./Container.style";

function Container(props) {
  const { title, children, className } = props;
  return (
    <ContainerStyle className={className}>
      <h3 className="title">{title}</h3>

      <article className="container-content">{children}</article>
    </ContainerStyle>
  );
}

export default Container;
