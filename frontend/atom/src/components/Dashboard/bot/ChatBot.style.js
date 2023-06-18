import styled from "styled-components";
import { FlexboxStyle, Poisitioning } from "../../../styles/commonStyle";

export const ChatBotStyle = styled.article`
  ${Poisitioning({ position: "fixed", right: "0px", bottom: "80px" })};

  .chatbot-icon {
    ${Poisitioning({ position: "absolute", right: "20px" })}

    > svg {
      width: 70px;
      height: 5rem;

      cursor: pointer;

      .icon-background {
        fill: ${(p) => (p.show ? "#3D9E47" : "")};
      }

      .robot-face {
        fill: ${(p) => (p.show ? "#fff" : "")};
      }

      .robot-body {
        fill: ${(p) => (p.show ? "#fff" : "")};
      }
    }
  }

  .chat-box {
    ${Poisitioning({ position: "absolute", bottom: "-20px", right: "30px" })};

    background-color: white;
    z-index: 2147483648;
    height: 500px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 8px;
    width: 400px;
    box-shadow: 1.99969px 3.99938px 53px rgba(45, 51, 63, 0.12);

    .chatbox-header {
      ${FlexboxStyle};

      background: #ccf6a8;
      padding: 10px 20px;
      margin: 0px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;

      .header-content {
        ${FlexboxStyle({ justify: "flex-start", gap: "10px" })};

        img {
          max-width: 80px;
        }

        h3 {
          margin: 0;
          color: #31873a;
          font-size: 12px;
          font-weight: 600;
        }
      }

      span {
        ${FlexboxStyle({ justify: "center" })};

        cursor: pointer;

        > svg {
          width: 25px;
        }
      }
    }

    .chat-body {
      padding: 10px;

      .conversation-Box {
        height: 360px;
        padding: 0 10px;

        overflow-y: auto;
        z-index: 1;
      }

      .chat-input {
        ${FlexboxStyle};

        z-index: 2;
        border-top: 1px solid #c5c5c5;
        margin-top: 20px;

        input {
          outline: none;
          font-size: 12px;

          &::placeholder {
            color: #9f9f9f;
          }
        }

        .icon {
          cursor: pointer;

          > svg {
            width: 30px;
          }
        }
      }
    }
  }
`;
