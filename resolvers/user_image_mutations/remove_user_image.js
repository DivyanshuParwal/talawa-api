const authCheck = require('../functions/authCheck');
const User = require('../../models/User');
const deleteImage = require('../../helper_functions/deleteImage');
const { NotFound } = require('../../core/errors');
const requestContext = require('../../core/libs/talawa-request-context');

module.exports = async (parent, args, context) => {
  authCheck(context);
  const user = await User.findById(context.userId);
  if (!user) {
    throw new NotFound(
      requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  if (!user.image) {
    throw new NotFound(
      requestContext.translate('user.profileImage.notFound'),
      'user.profileImage.notFound',
      'userProfileImage'
    );
  }

  await deleteImage(user.image);

  const newUser = await User.findOneAndUpdate(
    {
      _id: user.id,
    },
    {
      $set: {
        image: null,
      },
    },
    {
      new: true,
    }
  );
  return newUser;
};
