const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const passport = require('../config/passport');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

/* GET home page. */

router.use(cookieParser());

router.get('/protected/', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.status(200).json({ success: true, msg: 'You are authorized' });
});


router.post('/api/post/create', passport.authenticate('jwt', {session: false}), postController.post_create);
router.get('/api/post/:id/', postController.post_get);
router.get('/api/posts/', postController.post_all);
router.get('/api/posts/published/', postController.post_all_published);
router.get('/api/posts/user/', passport.authenticate('jwt', {session: false}), postController.post_all_user);
router.put('/api/post/:id/', passport.authenticate('jwt', {session: false}), postController.post_edit_post);
router.delete('/api/post/:id/', passport.authenticate('jwt', {session: false}), postController.post_delete_post);
router.post('/api/post/:id/comments/add', passport.authenticate('jwt', {session: false}), postController.post_create_comment);
router.delete('/api/post/:postid/comments/:commentid/', passport.authenticate('jwt', {session: false}), postController.post_delete_comment);
router.put('/api/comment/:id/', passport.authenticate('jwt', {session: false}), postController.post_edit_comment);
router.get('/api/comment/:id/', passport.authenticate('jwt', {session: false}), postController.post_get_comment);

router.post('/api/user/create', userController.user_create_post);
router.post('/api/user/login', userController.user_login_post);
router.get('/api/user/:id', userController.user_get);


router.get('/verify-user', passport.authenticate('jwt', {session: false}), function(req, res, next) {
  res.json({valid: true, user: req.user});
});

module.exports = router;
