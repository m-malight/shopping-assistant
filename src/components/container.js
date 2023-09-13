import React, { useEffect, useRef } from "react";
import { Message, InputBox, Header } from "./utils";
import "./component.css";

export const Container = ({
  chatHistory,
  onFormSubmit,
  onInputChange,
  userInput,
}) => {
  const ref = useRef({});

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="header">
        <Header />
      </div>
      <div ref={ref} className="body">
        {chatHistory.map((message, index) => (
          <Message key={index} text={message.text} isUser={message.isUser} />
        ))}
      </div>
      <div className="footer">
        <InputBox
          onChange={onInputChange}
          userInput={userInput}
          onSubmit={onFormSubmit}
        />
      </div>
    </div>
  );
};
