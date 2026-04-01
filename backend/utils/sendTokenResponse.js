const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
      expires:  new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "lax",
    };
    if (process.env.NODE_ENV === "production") options.secure = true;
  
    res
      .status(statusCode)
      .cookie("token", token, options)
      .json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  };
  module.exports = sendTokenResponse;
  