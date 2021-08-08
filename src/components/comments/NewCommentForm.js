import { useEffect, useRef } from "react";
import useHttp from "../hooks/use-http";
import classes from "./NewCommentForm.module.css";

const NewCommentForm = (props) => {
  const commentTextRef = useRef();
  //NOTE if we use props to get quote id  is super flexible.
  //NOTE  if we use params to get quote id will be fine with restricting it to be used in places where the URL contains the id only.

  const { error, status, sendRequestF: sendNewComment } = useHttp();
  const { onAddComment } = props;

  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (status === "completed") {
      onAddComment();
    }
  }, [status, onAddComment]);

  /* -------------------------------------------------------------------------- */
  const submitFormHandler = (event) => {
    event.preventDefault();
    // send comment to firebase
    sendNewComment({
      url: "https://react-http-9f84f-default-rtdb.firebaseio.com/comments.json",
      method: "POST",
      data: {
        content: commentTextRef.current.value,
        quoteId: props.quoteId,
      },
      headers: { "Content-Type": "application/json" },
    });
  };

  /* -------------------------------------------------------------------------- */
  return (
    <form className={classes.form} onSubmit={submitFormHandler}>
      {error && (
        <div className={classes.error}>
          Failed: Adding comment not succeeded
        </div>
      )}
      <div className={classes.control} onSubmit={submitFormHandler}>
        <label htmlFor="comment">Your Comment</label>
        <textarea id="comment" rows="5" ref={commentTextRef}></textarea>
      </div>
      <div className={classes.actions}>
        <button className="btn">Add Comment</button>
      </div>
    </form>
  );
};

export default NewCommentForm;
