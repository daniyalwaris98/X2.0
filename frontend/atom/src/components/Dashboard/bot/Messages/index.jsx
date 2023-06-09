import React from "react";
// import { format } from "timeago.js";
import "../MainStyle.css";
import botLogo from "../assets/botlogo.svg";
import userLogo from "../assets/userlogo.svg";
import { BotIcon } from "../../../../svg";

const index = ({ own, text }) => {
  return (
    <div className={own ? "message own" : "message"}>
      {own ? (
        <div
          className="messageTop"
          style={{
            flexDirection: "row-reverse",
            marginBottom: "10px",
          }}
        >
          <img className="messageImgUser" src={userLogo} alt="" />
          <p
            className="messageText"
            style={{
              marginBottom: "0px",
              border: "1px solid #FAFAFA",
              // borderBottomRightRadius: "20px 20px",
              borderTopRightRadius: "20px 20px",
              // borderTopLeftRadius: "20px solid #c6fb8952",
              borderBottomLeftRadius: "20px 20px",
              borderTopLeftRadius: "20px 20px",
            }}
          >
            {text}
            {/* {message.text} */}
          </p>
        </div>
      ) : (
        <div
          className="messageTop"
          style={{
            marginBottom: "10px",
          }}
        >
          <span className="bot-icon">
            <BotIcon />
          </span>
          {/* <img className="messageImg" src={botLogo} alt="" /> */}
          <p
            className="messageText"
            style={{
              marginBottom: "0px",
              border: "1px solid #c6fb8952",
              borderBottomRightRadius: "20px 20px",
              borderTopRightRadius: "20px 20px",
              // borderTopLeftRadius: "20px solid #c6fb8952",
              // borderBottomLeftRadius: "20px solid #c6fb8952",
              borderTopLeftRadius: "20px 20px",
            }}
          >
            {text}
            {/* {message.text} */}
          </p>
        </div>
      )}
      {/* <div className="messageBottom">
        11/11/1111
        {/* {format(message.createdAt)} 
      </div> */}
    </div>
  );
};

export default index;
