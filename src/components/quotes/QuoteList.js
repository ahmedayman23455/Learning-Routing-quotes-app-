import { Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";
import QuoteItem from "./QuoteItem";
import classes from "./QuoteList.module.css";

const sortQuotes = (quotes, ascending) => {
  return quotes.sort((quoteA, quoteB) => {
    if (ascending) {
      return quoteA.author > quoteB.author ? 1 : -1;
    } else {
      return quoteA.author < quoteB.author ? 1 : -1;
    }
  });
};

const QuoteList = (props) => {
  // console.log(props.quotes);
  const history = useHistory();
  const location = useLocation();
  const queryParamterObj = new URLSearchParams(location.search);
  const sortingIsAsscending = queryParamterObj.get("sort") === "asc";
  const sortedQuotes = sortQuotes(props.quotes, sortingIsAsscending);

  const changeSortingHandler = () => {
    history.push({
      pathname: location.pathname,
      search: `?sort=${sortingIsAsscending ? "des" : "asc"}`,
    });
  };
  return (
    <Fragment>
      <div className={classes.sorting}>
        <button onClick={changeSortingHandler}>
          Sort {sortingIsAsscending ? "descending" : "assceding"} (Names)
        </button>
      </div>
      <ul className={classes.list}>
        {sortedQuotes.map((quote) => (
          <QuoteItem
            key={quote.id}
            id={quote.id}
            author={quote.author}
            text={quote.text}
          />
        ))}
      </ul>
    </Fragment>
  );
};

export default QuoteList;
