import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Message from "./Messages/index.jsx";
import { ChatIcon, CrossIcon, SendIcon } from "../../../svg";
import { ChatBotStyle } from "./ChatBot.style";

const ChatBot = () => {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState([{ text: "How can I help you?", own: false }]);
  const [showDemoMsg, setShowDemoMsg] = useState(true);
  const [inputMsg, setInputMsg] = useState("");
  const [showBox, setShowBox] = useState(true);
  const ScrollRef = useRef();

  const URL = "https://bot.nets-x-map.com/ask";

  useEffect(() => {
    ScrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msg]);

  const sendMsgFunction = () => {
    msg.push({ text: inputMsg, own: true });
    setMsg(msg);
    setInputMsg("");

    axios
      .post(URL, {
        question: inputMsg,
      })
      .then((res) => {
        if (res.data.response.trim() !== "") {
          setMsg([
            ...msg,
            {
              text: res.data.response,
              own: false,
            },
          ]);
        } else {
          setMsg([
            ...msg,
            {
              text: `I'm sorry, but I don't understand what you mean by "${inputMsg}"`,
              own: false,
            },
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // axios
    //   .get(
    //     "https://192.168.10.224:5001" + "/monetx/user/query/" + inputMsg,
    //     header

    //     // header
    //   )
    //   .then((respose) => {
    //     msg.push({ text: respose.data, own: false });
    //     setMsg(msg);
    //     setShow(true);
    //     setLoading(false);

    //     setShowDemoMsg(false);
    //   });
  };

  useEffect(() => {
    console.log(msg);
  }, [msg]);

  return (
    <ChatBotStyle show={show}>
      {show ? (
        <div className="chat-box">
          <div className="chatbox-header">
            <article className="header-content">
              <img src="/site-logo.png" alt="Site logo" />
              <h3 className="text">Chatbot Assistance</h3>
            </article>
            <span
              className="icon"
              onClick={() => {
                setShow(false);
                if (showDemoMsg && !showBox) {
                  setMsg([{ text: "How can I help you?", own: false }]);
                  setShowDemoMsg(false);
                  setShowBox(true);
                }
              }}
            >
              <CrossIcon />
            </span>
          </div>

          <div className="chat-body">
            <div className="conversation-Box">
              {msg.map((value, key) => {
                return (
                  <div ref={ScrollRef}>
                    <Message key={key} text={value.text} own={value.own} />
                  </div>
                );
              })}
            </div>

            <div className="chat-input">
              <input
                type="text"
                className="chatMessageInput"
                placeholder="Type your message here..."
                onChange={(e) => setInputMsg(e.target.value)}
                value={inputMsg}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    sendMsgFunction();
                  }
                }}
              />

              <span
                className="icon"
                onClick={() => {
                  sendMsgFunction();
                }}
              >
                <SendIcon />
              </span>
            </div>
          </div>
        </div>
      ) : null}

      <span
        className="chatbot-icon"
        onClick={() => {
          setShow(!show);
        }}
      >
        <ChatIcon />
      </span>
    </ChatBotStyle>
  );
};

export default ChatBot;
