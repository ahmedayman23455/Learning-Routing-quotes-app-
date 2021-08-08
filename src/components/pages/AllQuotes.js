import React, { useEffect, useState } from "react";
import useHttp from "../hooks/use-http";
import QuoteList from "../quotes/QuoteList";
import LoadingSpinner from "../UI/LoadingSpinner";
import NoQuotesFound from "../quotes/NoQuotesFound";

const AllQuotes = () => {
  const [quotes, setQuotes] = useState([]);
  const { error, status, sendRequestF: fetchQuotesF } = useHttp();

  useEffect(() => {
    // handling quotes data
    const handleDataF = (data) => {
      if (data !== null) {
        const fetchedQuotes = [];
        for (let [key, value] of Object.entries(data)) {
          let obj = { id: key, ...value };
          fetchedQuotes.push(obj);
        }
        setQuotes(fetchedQuotes);
      }
    };
    //NOTE: fetchData from firebase
    fetchQuotesF(
      {
        method: "GET",
        url: "https://react-http-9f84f-default-rtdb.firebaseio.com/quotes.json",
      },
      handleDataF
    );
  }, [fetchQuotesF, setQuotes]);

  if (error) {
    return <p> {error}</p>;
  }
  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (status === "completed" && (!quotes || quotes.length === 0) && !error) {
    return <NoQuotesFound />;
  }

  if (!quotes) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <QuoteList quotes={quotes} />
    </div>
  );
};

export default AllQuotes;
