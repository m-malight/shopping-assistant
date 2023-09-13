import { Container } from "./components/container";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { gapi } from "gapi-script";
import detectIntent from "./api/dialogflow";
import "./App.css";

// const apiKey = "AIzaSyD6Vi41lTqT2nWWc7ZgurGU0Vo0OgzDvU8";
const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [token, setToken] = useState("");
  const [conversationState, setConversationState] = useState("");
  const { REACT_APP_PROJECT_ID: projectId } = process.env;
  const { REACT_APP_OPEN_KEY: OPEN_KEY } = process.env;

  const processUserInput = async (diagReply) => {
    console.log(chatHistory);
    switch (conversationState) {
      case "PRODUCT_INQUIRY":
        // Process PRODUCT_INQUIRY and respond to user
        //... SOME CODES HERE
        diagReply = "processed reply base on PRODUCT_INQUIRY";
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      case "PRODUCT_DETAILS":
        // Process PRODUCT_DETAILS
        //... SOME CODES HERE
        diagReply = "processed reply base on PRODUCT_DETAILS";
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      case "ADDING_TO_CART":
        // Process ADDING_TO_CART
        //... SOME CODES HERE
        diagReply = "processed reply base on ADDING_TO_CART";
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      case "CHECKOUT_ASSISTANCE":
        // Process CHECKOUT_ASSISTANCE
        //... SOME CODES HERE
        diagReply = "processed reply base on CHECKOUT_ASSISTANCE";
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      case "POST_PURCHASE_SUPPORT":
        // Process POST_PURCHASE_SUPPORT
        //... SOME CODES HERE
        diagReply = "processed reply base on POST_PURCHASE_SUPPORT";
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      default:
        // NO conversation matched
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
    }
  };

  const handleDialogflow = async () => {
    const sessionId = uuidv4();
    const queryInput = {
      queryInput: {
        text: {
          text: userInput,
          languageCode: "en-US",
        },
      },
    };

    const { data: response, token: accessToken } = await detectIntent({
      token_exist: token !== "",
      projectId,
      sessionId,
      queryInput,
      token,
    });

    setToken(accessToken);
    const diagReply = response.queryResult.fulfillmentText;
    setConversationState(
      Object.keys(response.queryResult.parameters?.fields || {})[0]
    );

    processUserInput(diagReply);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (userInput) {
      setChatHistory([...chatHistory, { text: userInput, isUser: true }]);
      setUserInput("");
      handleDialogflow();
    }
  };

  useEffect(() => {
    const init = () => {
      gapi.client.init({
        clientId: OPEN_KEY,
        scope: "https://www.googleapis.com/auth/dialogflow",
      });
    };

    gapi.load("client:auth2", init);
  }, [OPEN_KEY]);

  return (
    <div className="chatbot">
      <Container
        chatHistory={chatHistory}
        onFormSubmit={handleFormSubmit}
        onInputChange={handleInputChange}
        userInput={userInput}
      />
    </div>
  );
};

export default Chatbot;
