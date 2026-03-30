const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const crypto   = require("crypto");

const UserSchema = new mongoose.Schema(
  {
    name:  { type: String, required: [true, "Please add a name"], trim: true, maxlength: 50 },
    email: { type: String, required: [true, "Please add an email"], unique: true, lowercase: true,
             match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"] },
    password: { type: String, required: [true, "Please add a password"], minlength: 6, select: false },
    role:   { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String, default: "default-avatar.png" },
    phone:  { type: String, default: "" },
    address: {
      street:  { type: String, default: "" },
      city:    { type: String, default: "" },
      state:   { type: String, default: "" },
      zip:     { type: String, default: "" },
      country: { type: String, default: "" },
    },
    wishlist: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    resetPasswordToken:  String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken  = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

UserSchema.virtual("orders", { ref: "Order", localField: "_id", foreignField: "user", justOne: false });

module.exports = mongoose.model("User", UserSchema);
