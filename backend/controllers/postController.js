const { body, validationResult } = require("express-validator");
const Post = require("../models/post");
const asyncHandler = require("express-async-handler");
const utils = require("../lib/utils");
const { isValidObjectId } = require("mongoose");
const Comment = require("../models/comment");
const mongoose = require("mongoose");
const { format } = require("date-fns");

exports.post_create = [
  body("title", "Title must be required")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "A Description is required")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("published").isBoolean(),

  asyncHandler(async (req, res, next) => {
    if (req.user.author) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newPost = new Post({
        title: req.body.title,
        time_stamp: new Date(),
        description: req.body.description,
        user: req.user,
        comments: [],
        published: req.body.published,
      });

      await newPost.save().then((data) => {
        return res.json({
          success: true,
          message: "Post saved!",
          post: data,
        });
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to do this.",
      });
    }
  }),
];

exports.post_all = asyncHandler(async (req, res, next) => {
  const postData = await Post.find({}).populate("user").lean();
  if (!postData) {
    return res.json({
      success: true,
      message: "There's no post available, create one!",
    });
  } else {
    const formattedPosts = postData.map((post) => ({
      ...post,
      time_stamp_formatted: format(post.time_stamp, "MMM dd, yyyy hh:mm a"),
    }));

    return res.json({
      postData: formattedPosts,
    });
  }
});

exports.post_all_published = asyncHandler(async (req, res, next) => {
  const postData = await Post.find({ published: true }).populate("user").lean();
  if (!postData) {
    return res.json({
      success: true,
      message: "There's no post available, create one!",
    });
  } else {
    const formattedPosts = postData.map((post) => ({
      ...post,
      time_stamp_formatted: format(post.time_stamp, "MMM dd, yyyy hh:mm a"),
    }));

    return res.json({
      postData: formattedPosts,
    });
  }
});

exports.post_all_user = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const postsData = await Post.find({ user: userId }).populate("user").lean();
  const formattedPosts = postsData.map((p) => ({
    ...p,
    time_stamp: format(p.time_stamp, "MMM dd, yyy hh:mm a"),
  }))
  if(!postsData) {
    return res.status(404).json({
      success: false,
      message: "No posts found."
    })
  } else {
    return res.json({
      success: true,
      message: "Posts found",
      posts: formattedPosts,
    })
  }
});

exports.post_get = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  if (!isValidObjectId(postId)) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  const postData = await Post.findOne({ _id: postId }).populate("user").lean();
  const commentsFromPost = await Comment.find({ post: postId })
    .populate("user")
    .lean();
  const formattedComments = commentsFromPost.map((comment) => ({
    ...comment,
    user: { _id: comment.user._id, username: comment.user.username },
    time_stamp: format(comment.time_stamp, "MMM dd, yyyy hh:mm a"),
  }));
  if (!postData) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  } else {
    return res.json({
      postData: {
        ...postData,
        time_stamp: format(postData.time_stamp, "MMM dd, yyyy hh:mm a"),
        user: { _id: postData.user._id, username: postData.user.username },
        comments: formattedComments,
      },
      comments: formattedComments,
    });
  }
});

exports.post_edit_post = [
  body("title", "Title must be required")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "A Description is required")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("published").isBoolean(),

  asyncHandler(async (req, res, next) => {
    const postId = req.params.id;
    if (!isValidObjectId(postId)) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }
    const postData = await Post.findOne({ _id: postId });
    if (
      !req.user.author &&
      postData.user.toString() !== req.user._id.toString()
    ) {
      return res.status(401).json({
        success: false,
        message: "You are not allowed to do this.",
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!postData) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    } else {
      const postEdited = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published,
      };

      await Post.findByIdAndUpdate(postId, postEdited).then((post) => {
        return res.json({
          success: true,
          message: "Edit Post saved!",
        });
      });
    }
  }),
];

exports.post_delete_post = asyncHandler(async (req, res, next) => {
  const postId = req.params.id;
  if (!isValidObjectId(postId)) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  const postData = await Post.findById(postId);
  if (!postData) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }

  if (
    !req.user.author &&
    postData.user.toString() !== req.user._id.toString()
  ) {
    return res.status(401).json({
      success: false,
      message: "You are not allowed to do this.",
    });
  }

  try {
    await Comment.deleteMany({ post: postId });

    await Post.findByIdAndDelete(postId);

    res.json({
      success: true,
      message: "Post and associated comments deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting post and comments.",
      error: error.message,
    });
  }
});

exports.post_get_comment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.id;
  if (!isValidObjectId(commentId)) {
    return res.status(404).json({
      success: false,
      message: "Comment not found.",
    });
  }
  const comment = await Comment.findById({ _id: commentId });
  if (comment) {
    res.json({
      success: true,
      comment: comment,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "Comment not found.",
    });
  }
});

exports.post_create_comment = [
  body("description", "Your comment cannot be empty.")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const postId = req.params.id;

    if (!isValidObjectId(postId)) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const postData = await Post.findById(postId);

    if (postData && postData.published === true) {
      const newComment = new Comment({
        time_stamp: new Date(),
        description: req.body.description,
        user: req.user,
        post: postData,
      });

      const savedComment = await newComment.save();

      await Post.findByIdAndUpdate(postId, {
        $push: { comments: savedComment._id },
      });

      res.json({
        success: true,
        comment: {
          ...savedComment._doc,
          time_stamp: format(savedComment.time_stamp, "MMM dd, yyyy hh:mm a"),
        },
        message: "Comment added successfully",
      });
    } else {
      res.status(401).json({
        success: false,
        message: "This post doesn't exists or is not published",
      });
    }
  }),
];

exports.post_edit_comment = [
  body("description", "Your comment cannot be empty.")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const commentId = req.params.id;
    if (!isValidObjectId(commentId)) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const commentData = await Comment.findById(commentId).populate("user");

    if (!commentData) {
      res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (commentData.user._id.toString() === req.user._id.toString()) {
      const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        { description: req.body.description },
        { new: true }
      );

      res.json({
        success: true,
        message: "Comment updated successfully",
        comment: {...updatedComment._doc, time_stamp: format(updatedComment._doc.time_stamp, "MMM dd, yyyy hh:mm a"), user: commentData.user},
      });
    } else {
      res.status(401).json({
        success: false,
        message: "You are not allowed to do this action.",
      });
    }
  }),
];

exports.post_delete_comment = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentid;
  const postId = req.params.postid;

  if (!isValidObjectId(postId)) {
    return res.status(404).json({
      success: false,
      message: "Post not found.",
    });
  }
  if (!isValidObjectId(commentId)) {
    return res.status(404).json({
      success: false,
      message: "Comment not found.",
    });
  }

  const commentData = await Comment.findById(commentId);
  const postData = await Post.findById(req.params.postid);

  if (!commentData) {
    res.status(404).json({
      success: false,
      message: "Comment not found",
    });
  }

  if (
    commentData.user.toString() === req.user._id.toString() ||
    postData.user.toString() === req.user._id.toString()
  ) {
    await Comment.findByIdAndDelete(commentId);

    await Post.updateOne(
      { comments: commentId },
      { $pull: { comments: commentId } }
    );

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "You are not allowed to do this action.",
    });
  }
});
