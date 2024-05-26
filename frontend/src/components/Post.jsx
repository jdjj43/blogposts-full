import React, { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  fetchCreateComment,
  fetchDeleteComment,
  fetchDeletePost,
  fetchEditComment,
  fetchEditPost,
  fetchGetComment,
  fetchPost,
} from "../helpers/apiHelper";
import "./Post.css";

const initialState = {
  post: {},
  comment: {},
  comments: [],
  selectedComment: "",
  isModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  errors: {},
  isEditCommentOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_POST":
      return { ...state, post: action.payload };
    case "SET_COMMENTS":
      return { ...state, comments: action.payload };
    case "SET_SELECTED_COMMENT":
      return { ...state, selectedComment: action.payload };
    case "SET_MODAL_OPEN":
      return { ...state, isModalOpen: action.payload };
    case "SET_EDIT_MODAL_OPEN":
      return { ...state, isEditModalOpen: action.payload };
    case "SET_DELETE_MODAL_OPEN":
      return { ...state, isDeleteModalOpen: action.payload };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    case "SET_COMMENT":
      return { ...state, comment: action.payload };
    case "SET_EDIT_COMMENT_OPEN":
      return { ...state, isEditCommentOpen: action.payload };
    default:
      return state;
  }
};

export const Post = ({ posts, setPosts, userData, loggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    description: "",
    published: false,
  });

  const [editCommentForm, setEditCommentForm] = useState("");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const getPost = async () => {
      try {
        const { postData, commentData } = await fetchPost(id);
        dispatch({ type: "SET_POST", payload: postData });
        dispatch({ type: "SET_COMMENTS", payload: commentData });
      } catch (error) {
        dispatch({ type: "SET_ERRORS", payload: error });
        navigate("/404");
      }
    };
    getPost();
  }, []);

  const handleOnOpen = (id) => {
    dispatch({ type: "SET_SELECTED_COMMENT", payload: id });
    dispatch({ type: "SET_MODAL_OPEN", payload: true });
  };

  const handleOnDelete = async () => {
    try {
      fetchDeleteComment(state.post._id, state.selectedComment);
      dispatch({ type: "SET_SELECTED_COMMENT", payload: "" });
      dispatch({
        type: "SET_COMMENTS",
        payload: state.comments.filter(
          (comment) => comment._id !== state.selectedComment
        ),
      });
      dispatch({ type: "SET_MODAL_OPEN", payload: false });
    } catch (error) {
      dispatch({ type: "SET_ERRORS", payload: error });
      console.log(error);
    }
  };

  const handleOnClose = () => {
    dispatch({ type: "SET_SELECTED_COMMENT", payload: "" });
    dispatch({ type: "SET_MODAL_OPEN", payload: false });
  };

  const handleOnSubmitForm = async (e) => {
    e.preventDefault();
    try {
      if (description !== "") {
        const comment = await fetchCreateComment(state.post._id, description);
        dispatch({
          type: "SET_COMMENTS",
          payload: [...state.comments, comment],
        });
        setDescription("");
      } else {
        dispatch({
          type: "SET_ERRORS",
          payload: { message: "Your comment must not be empty." },
        });
      }
    } catch (error) {
      dispatch({ type: "SET_ERRORS", payload: error });
      console.log(error);
    }
  };

  const handleOnEditOpen = () => {
    setEditForm({
      _id: state.post._id,
      title: state.post.title,
      description: state.post.description,
      published: state.post.published,
    });
    dispatch({ type: "SET_EDIT_MODAL_OPEN", payload: true });
  };

  const handleOnEditClose = () => {
    setEditForm({
      _id: "",
      title: "",
      description: "",
      published: false,
    });
    dispatch({ type: "SET_EDIT_MODAL_OPEN", payload: false });
  };

  const handleOnChangePost = (e) => {
    const { name, value, checked } = e.target;
    setEditForm((prevState) => ({
      ...prevState,
      [name]: name === "published" ? checked : value,
    }));
  };

  const handleOnSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await fetchEditPost(editForm);
      dispatch({
        type: "SET_POST",
        payload: {
          ...state.post,
          title: editForm.title,
          description: editForm.description,
          published: editForm.published,
        },
      });
      // if(posts[0] !== undefined) {
      //   setPosts([...posts, {_id:editForm._id, title: editForm.title, description: editForm.description, published: editForm.published}]);
      // }
      handleOnEditClose();
    } catch (error) {
      console.log(error);
      dispatch({ type: "SET_ERRORS", payload: error });
      handleOnEditClose();
    }
  };

  const handleOnDeleteOpen = () => {
    dispatch({ type: "SET_DELETE_MODAL_OPEN", payload: true });
  };

  const handleOnDeleteClose = () => {
    dispatch({ type: "SET_DELETE_MODAL_OPEN", payload: false });
  };

  const handleOnDeletePost = async () => {
    try {
      const onDelete = await fetchDeletePost(state.post._id);
      // if (posts) {
      //   setPosts(posts.filter((posts) => posts._id !== state.post._id));
      // }
      dispatch({ type: "SET_POST", payload: {} });
      dispatch({ type: "SET_DELETE_MODAL_OPEN", payload: false });
      navigate("/");
    } catch (error) {
      dispatch({ type: "SET_ERRORS", payload: error });
      console.log(error);
    }
  };

  const handleOnEditComentOpen = async (id) => {
    try {
      const response = await fetchGetComment(id);
      dispatch({ type: "SET_COMMENT", payload: response });
      setEditCommentForm(response.description);
      dispatch({ type: "SET_EDIT_COMMENT_OPEN", payload: true });
    } catch (error) {
      console.log(error);
    }
  };
  const handleOnEditComentClose = () => {
    setEditCommentForm({
      description: "",
    });
    dispatch({ type: "SET_COMMENT", payload: {} });
    dispatch({ type: "SET_EDIT_COMMENT_OPEN", payload: false });
  };
  const handleOnEdit = async (e) => {
    e.preventDefault();
    try {
      const editedComment = await fetchEditComment(
        state.comment._id,
        editCommentForm
      );
      dispatch({
        type: "SET_COMMENTS",
        payload: state.comments.map((c) =>
          c._id === editedComment._id ? editedComment : c
        ),
      });
      handleOnEditComentClose();
    } catch (error) {
      dispatch({ type: "SET_ERRORS", payload: error.message });
    }
  };

  return (
    <>
      <>
        {state.isEditCommentOpen && (
          <div className="modal">
            <div className="modal-content edit-post">
              <form onSubmit={handleOnEdit}>
                <legend>Edit Comment</legend>
                <div className="form-edit-post-input">
                  <label htmlFor="description">Message:</label>
                  <textarea
                    name="description"
                    value={editCommentForm}
                    onChange={(e) => setEditCommentForm(e.target.value)}
                    rows={10}
                  ></textarea>
                </div>
                <button type="submit">Save</button>
                <button onClick={handleOnEditComentClose}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </>
      <>
        {state.isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete this comment?</p>
              <button onClick={handleOnDelete}>Delete</button>
              <button onClick={handleOnClose}>Cancel</button>
            </div>
          </div>
        )}
      </>
      <>
        {state.isDeleteModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <p>Are you sure you want to delete this post?</p>
              <button onClick={handleOnDeletePost}>Delete</button>
              <button onClick={handleOnDeleteClose}>Cancel</button>
            </div>
          </div>
        )}
      </>
      <>
        {state.isEditModalOpen && (
          <div className="modal ">
            <div className="modal-content edit-post">
              <form onSubmit={handleOnSubmitEdit}>
                <legend>Edit Post: {editForm.title}</legend>
                <div className="form-edit-post-input">
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleOnChangePost}
                  />
                </div>
                <div className="form-edit-post-input">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    type="text"
                    name="description"
                    value={editForm.description}
                    onChange={handleOnChangePost}
                  />
                </div>
                <div className="form-edit-post-checkbox">
                  <input
                    type="checkbox"
                    name="published"
                    id="published"
                    placeholder="published"
                    onChange={handleOnChangePost}
                    checked={editForm.published}
                  />
                  <label htmlFor="published">Published</label>
                </div>
                <button type="submit">Send Post</button>
                <button onClick={handleOnEditClose}>Cancel</button>
              </form>
            </div>
          </div>
        )}
      </>
      {state.errors && <div className="errors">{state.errors.message}</div>}
      <div className="post-detail">
        <div>
          <h1 className="post-title">
            {state.post.title}
            {state.post.published ? "✅" : "❌"}
          </h1>
          <p className="timestamp">
            {state.post.user && state.post.user.username} -{" "}
            {state.post.time_stamp}
          </p>
          {state.post &&
          state.post._id &&
          userData._id !== undefined &&
          userData._id === state.post.user._id ? (
            <div className="edit-delete">
              <button
                onClick={handleOnEditOpen}
                className="submit-button edit-button"
              >
                Edit Post
              </button>
              <button
                onClick={handleOnDeleteOpen}
                className="submit-button delete-button"
              >
                Delete Post
              </button>
            </div>
          ) : null}
        </div>
        <br />
        <div className="post-description">
          <p>{state.post.description}</p>
        </div>
        <div className="comments">
          <h3 className="cmnt-title">Comments</h3>
          {state.comments[0] === undefined && (
            <h4 className="text-center">There's no comments yet!</h4>
          )}
          {state.comments &&
            state.comments.map((comment) => (
              <div className="comment" key={comment._id}>
                <div className="comment-user">
                  <h3>{comment.user.username}</h3>
                  <div>
                    {userData && userData._id === comment.user._id ? (
                      <button
                        onClick={() => handleOnEditComentOpen(comment._id)}
                        className="comment-btn"
                      >
                        ✏️
                      </button>
                    ) : null}
                    {(userData && userData._id === state.post.user._id) ||
                    userData._id === comment.user._id ? (
                      <button
                        onClick={() => handleOnOpen(comment._id)}
                        className="comment-btn"
                      >
                        ❌
                      </button>
                    ) : null}
                  </div>
                </div>
                <p>{comment.description}</p>
                <p className="lightgrey">{comment.time_stamp}</p>
              </div>
            ))}
          <br />
          {loggedIn && (
            <div className="comment-form">
              <form onSubmit={handleOnSubmitForm}>
                <div className="comment-input-container lightgrey">
                  <label htmlFor="comment">Leave a Comment!</label>
                  <textarea
                    name="comment"
                    id="comment"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                  ></textarea>
                </div>
                <div className="cmnt-button-container">
                  <button type="submit" className="cmnt-send">Send</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
