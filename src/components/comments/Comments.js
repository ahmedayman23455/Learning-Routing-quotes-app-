import { useCallback, useEffect, useState } from "react";
import useHttp from "../hooks/use-http";
import LoadingSpinner from "../UI/LoadingSpinner";
import classes from "./Comments.module.css";
import CommentsList from "./CommentsList";
import NewCommentForm from "./NewCommentForm";

const Comments = (props) => {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const { status, error, sendRequestF: fetchCommentsF } = useHttp();
  const quoteId = props.quoteId;
  /* -------------------------------------------------------------------------- */
  const startAddCommentHandler = () => {
    setIsAddingComment(true);
  };
  /* -------------------------------------------------------------------------- */
  // code will used in fetch component in useEffect and after click add comment in NewCommentForm.js
  const usableFetchFunction = useCallback(() => {
    const handleDataF = (data) => {
      if (data !== null) {
        const commentsArray = [];
        for (let [key, value] of Object.entries(data)) {
          if (value.quoteId === quoteId) {
            commentsArray.push({ id: key, ...value });
          }
        }
        setComments(commentsArray);
      }
    };

    fetchCommentsF(
      {
        method: "GET",
        url: "https://react-http-9f84f-default-rtdb.firebaseio.com/comments.json",
      },
      handleDataF
    );
  }, [fetchCommentsF, quoteId]);

  /* ----------------------------- fetch comments  ----------------------------- */
  useEffect(() => {
    usableFetchFunction();
  }, [usableFetchFunction]);
  /* ---------------- method will pass to (NewCommentForm.js) ---------------- */
  const addCommentHandler = useCallback(() => {
    usableFetchFunction();
  }, [usableFetchFunction]);

  /* -------------------------- conditions of content ------------------------- */
  let content;
  if (error) {
    content = <p>Failed fetched comments ❌🛑</p>;
  }
  if (status === "pending") {
    content = (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }
  if (status === "completed" && !error) {
    content = <CommentsList comments={comments} />;
  }
  if (
    status === "completed" &&
    (!comments || comments.length === 0) &&
    !error
  ) {
    content = <p className="centered">No comments were added yet ❗</p>;
  }

  /* ------------------------------ return method ----------------------------- */
  return (
    <section className={classes.comments}>
      <h2>User Comments</h2>

      {!isAddingComment && (
        <button className="btn" onClick={startAddCommentHandler}>
          Add a Comment
        </button>
      )}
      {isAddingComment && (
        <NewCommentForm
          quoteId={props.quoteId}
          onAddComment={addCommentHandler}
        />
      )}
      {content}
    </section>
  );
};

export default Comments;
