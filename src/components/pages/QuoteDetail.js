import React, { useEffect, useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import Comments from "../comments/Comments";
import HighlightedQuote from "../quotes/HighlightedQuote";
import { useRouteMatch } from "react-router-dom";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import NoQuotesFound from "../quotes/NoQuotesFound";
//************************************************ */
const QuoteDetail = () => {
  const params = useParams();
  const segmentId = params.quoteId;
  const [quotes, setQuotes] = useState([]);

  const { status, error, sendRequestF: fetchQuotesF } = useHttp();

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

  const activeQuote = quotes.find((quote) => quote.id === segmentId);
  const routeMatchObj = useRouteMatch();

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

  if (status === "completed" && quotes.length === 0) {
    return <NoQuotesFound />;
  }
  if (!activeQuote) {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    //todo:
    <div>
      <HighlightedQuote text={activeQuote.text} author={activeQuote.author} />

      <Route path={`${routeMatchObj.path}`} exact>
        <div className="centered">
          <Link className="btn--flat" to={`${routeMatchObj.url}/comments`}>
            Load Comments
          </Link>
        </div>
      </Route>

      <Route path={`${routeMatchObj.path}/comments`}>
        <Comments quoteId={params.quoteId} />
      </Route>
    </div>
  );
};

export default QuoteDetail;
