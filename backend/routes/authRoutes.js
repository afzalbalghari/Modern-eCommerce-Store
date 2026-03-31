const express = require("express");
const router  = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  toggleWishlist,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

// Public
router.post("/register",                     register);
router.post("/login",                        login);
router.post("/forgotpassword",               forgotPassword);
router.put("/resetpassword/:resettoken",     resetPassword);

// Protected
router.get("/logout",                        protect, logout);
router.get("/me",                            protect, getMe);
router.put("/updatedetails",                 protect, updateDetails);
router.put("/updatepassword",                protect, updatePassword);
router.put("/wishlist/:productId",           protect, toggleWishlist);

module.exports = router;
