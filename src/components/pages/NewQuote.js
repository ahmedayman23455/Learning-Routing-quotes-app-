import React, { Fragment, useEffect } from "react";
import QuoteForm from "../quotes/QuoteForm";
import { useHistory } from "react-router-dom";
import useHttp from "../hooks/use-http";

const NewQuote = () => {
  const history = useHistory();
  const { status, sendRequestF: sendNewQuoteF } = useHttp();

  useEffect(() => {
    if (status === "completed") {
      history.push("/quotes");
    }
  }, [status, history]);

  // NOTE send new qoute to firebase
  const addQuoteHandler = (newQuote) => {
    sendNewQuoteF({
      url: "https://react-http-9f84f-default-rtdb.firebaseio.com/quotes.json",
      method: "POST",
      data: newQuote,
      headers: { "Content-Type": "application/json" },
    });
    //will lead to Error
    // history.push("/quotes");
  };

  return (
    <Fragment>
      <QuoteForm
        isLoading={status === "pending"}
        onAddQuote={addQuoteHandler}
      />
    </Fragment>
  );
};

export default NewQuote;
