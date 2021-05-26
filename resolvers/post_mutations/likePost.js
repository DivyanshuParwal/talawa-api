const User = require('../../models/User');
const Post = require('../../models/Post');

const authCheck = require('../functions/authCheck');
const { NotFound } = require('../../core/errors');
const requestContext = require('../../core/libs/talawa-request-context');

const likePost = async (parent, args, context) => {
  authCheck(context);
  const user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new NotFound(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  const post = await Post.findOne({ _id: args.id });
  if (!post) {
    throw new NotFound(
      requestContext.translate('post.notFound'),
      'post.notFound',
      'post'
    );
  }

  if (!post.likedBy.includes(context.userId)) {
    const newPost = await Post.findOneAndUpdate(
      { _id: args.id },
      {
        $push: {
          likedBy: user,
        },
      },
      { new: true }
    );
    return newPost;
  }
  return post;
};

module.exports = likePost;
