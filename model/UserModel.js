const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
    },

    email: {
      type: String,
      required: [true, "Please enter your email"],
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please add a password!"],
      minLength: [6, "Password must be up to 6 characters"],
    },

    role: {
      type: String,
      required: [true],
      default: "customer",
      enum: ["customer", "admin"],
    },

    photo: {
      type: String,
      required: [true, "Please add a photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },

    phone: {
      type: String,
      default: "+44",
    },

    address: {
      type: Object, //address, state, country
    },
  },

  { timestamps: true }
);

// To Encrypt password before saving to the Database
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  } else {
    // To Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
