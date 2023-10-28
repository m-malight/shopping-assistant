import { Container } from "./components/container";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { gapi } from "gapi-script";
import detectIntent from "./api/dialogflow";
import "./App.css";
import mockData from "./mock-data";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [token, setToken] = useState("");
  const [recommendation, setRecommendation] = useState("");
  const { REACT_APP_PROJECT_ID: projectId } = process.env;
  const { REACT_APP_OPEN_KEY: OPEN_KEY } = process.env;
  const conversation_state = {
    "product.inquiry": "PRODUCT_INQUIRY",
    "product.details": "PRODUCT_DETAILS",
    "post_purchase.support": "POST_PURCHASE_SUPPORT",
  };

  const processUserInput = async (diagReply, state, param) => {
    console.log("working", param, state);
    switch (state) {
      case "PRODUCT_INQUIRY":
        // Process PRODUCT_INQUIRY and respond to user
        const param_to_lowercase = param.toLowerCase();
        console.log("inquiry");
        diagReply =
          "Thank you for your inquiry. Unfortunately, we don't have the product you're looking for. Can you please ask for another recommendation? We'd be happy to assist you.";
        if (param_to_lowercase in mockData) {
          setRecommendation(param_to_lowercase);
          diagReply = "";
          mockData[param_to_lowercase].map((itm, i) => {
            diagReply += `${itm.name}<br/>`;
            return itm;
          });
          diagReply +=
            "<br/>Which one would you like me to give you more details on?";
        }
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      case "PRODUCT_DETAILS":
        // Process PRODUCT_DETAILS
        diagReply =
          "Sorry, we can't find more details for the product you have selected.";
        console.log(recommendation);
        if (recommendation) {
          const product = mockData[recommendation].find(
            (itm) => itm.name === param
          );
          if (product) {
            diagReply = `<b>Name</b>: ${product.name}<br/><b>Price</b>: ${product.price}<br/><b>Summary</b>: ${product.summary}`;
          }
        }
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      case "POST_PURCHASE_SUPPORT":
        // Process POST_PURCHASE_SUPPORT
        const list_of_rec = Object.keys(mockData).filter(
          (itm) => itm !== recommendation
        );
        diagReply = `Thank you for considering our recommendation in ${recommendation}. We're thrilled to have been of help! If you're looking for recommendations in other areas, such as ${list_of_rec
          .slice(0, 3)
          .toString()} or more, we'd be delighted to assist further`;
        setChatHistory((chatHistory) => [
          ...chatHistory,
          { text: diagReply, isUser: false },
        ]);
        break;
      default:
        //pass
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

    const param =
      response.queryResult.parameters[
        Object.keys(response.queryResult.parameters || {})
      ];
    setToken(accessToken);
    const state = conversation_state[response.queryResult.action];
    const diagReply = response.queryResult.fulfillmentText;
    setChatHistory((chatHistory) => [
      ...chatHistory,
      { text: diagReply, isUser: false },
    ]);

    setTimeout(() => {
      processUserInput(diagReply, state, param);
    }, 3000);
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
