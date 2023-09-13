import React from "react";
import "./component.css";
import logo from "../logo.svg";

export const Message = ({ text, isUser }) => {
  return <div className={isUser ? "message-user" : "message-bot"}>{text}</div>;
};

export const InputBox = ({ onChange, onSubmit, userInput }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="inputbox">
        <input
          className="ask"
          placeholder="Ask me"
          type="text"
          value={userInput}
          onChange={onChange}
        />
        <button
          style={{
            marginLeft: "15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
          type="submit"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export const Header = () => {
  return (
    <div className="firstlayer">
      <img src={logo} alt="OpenReplay Logo" />
      <p>Chat with OpenReplay</p>
    </div>
  );
};
