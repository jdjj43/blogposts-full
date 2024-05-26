import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const fetchUser = async (token) => {
  try {
    const response = await axios.get("http://localhost:3000/verify-user", {
      headers: { Authorization: token },
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const fetchUserRegister = async (formData) => {
    const response = await axios.post("http://localhost:3000/api/user/create", formData);
    // console.log(response);
    return response;
}

export const fetchAllPosts = async () => {
  const url = "http://localhost:3000/api/post/";
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchAllPublished = async () => {
  const response = await axios.get("http://localhost:3000/api/posts/published");
  const data = await response.data.postData;
  return data;
};

export const fetchPost = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/post/${id}`);
  const postData = await response.data.postData;
  const commentData = await response.data.comments;
  return { postData, commentData };
};

export const fetchAddPost = async (title, description, published) => {
  const url = "http://localhost:3000/api/post/create/";
  const requestBody = {
    title: title,
    description: description,
    published: published,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Authorization"),
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchEditPost = async (formData) => {
  const response = await axios.put(`http://localhost:3000/api/post/${formData._id}`, {
    title: formData.title,
    description: formData.description,
    published: formData.published
  }, {
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    },
  });
  return response;
}

export const fetchDeletePost = async (postId) => {
  const response = await axios.delete(`http://localhost:3000/api/post/${postId}/`, {
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    }
  });
  return response;
}

export const fetchCreateComment = async (postId, description) => {
  const response = await axios.post(`http://localhost:3000/api/post/${postId}/comments/add`, { description },{
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    },
  });
  const comment = response.data.comment;
  return comment;
};

export const fetchGetComment = async (commentId) => {
  const response = await axios.get(`http://localhost:3000/api/comment/${commentId}`, {
    headers: {
      Authorization: localStorage.getItem("Authorization")
    }
  });
  const comment = response.data.comment;
  return comment;
}

export const fetchEditComment = async (commentId, description) => {
  const response = await axios.put(`http://localhost:3000/api/comment/${commentId}`, {
    description: description
  } ,{
    headers: {
      Authorization: localStorage.getItem("Authorization"),
    }
  });
  const comment = response.data.comment;
  return comment;
}

export const fetchDeleteComment = async (postId, commentId) => {
  await axios.delete(
    `http://localhost:3000/api/post/${postId}/comments/${commentId}/`,
    {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    }
  );
};

export const fetchPostsByUser = async () => {
  const posts = await axios.get(`http://localhost:3000/api/posts/user/`, {
    headers: {
      Authorization: localStorage.getItem('Authorization'),
    },
  });
  if(posts) {
    return posts.data.posts;
  } 
}