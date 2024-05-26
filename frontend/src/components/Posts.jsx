import React, { useEffect, useState } from "react";
import { fetchAllPosts, fetchAllPublished } from "../helpers/apiHelper";
import Loading from "./Loading/Loading";
import { Link } from "react-router-dom";

export const Posts = ({ posts, setPosts, userData }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    try {
      const getPosts = async () => {
        const postsdata = await fetchAllPublished();
        setPosts(postsdata);
        setIsLoading(false);
      };
      getPosts();
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      throw error;
    }
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <h1 className="title">Published Posts</h1>
      <div className="postsContainer">
        {posts.map((post) => (
          <div key={post._id} className="posts-post">
            <h1>{post.title}</h1>
            <p>
              <span className="by">{post.user && post.user.username}</span>
              <span className="timeStamp"> • {post.time_stamp_formatted}</span>
            </p>
            { post.description.length > 350 ? (<p>{post.description.slice(0, 350)}...</p>) : (<p>{post.description}</p>)}
            {/* {
              userData.author && userData._id === post.user._id ? <Link to={`/post/${post._id}/edit`}>Edit Post</Link> : <></>
            } */}
            <Link to={`/post/${post._id}`} className="see-more">
              See more!
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};
