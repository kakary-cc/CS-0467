import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const User = mongoose.model("User");

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user;
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};

const endAuthenticatedSession = (req) => {
  return new Promise((fulfill, reject) => {
    req.session.destroy((err) => (err ? reject(err) : fulfill(null)));
  });
};

const register = async (username, email, password) => {
  // TODO: implement registration
  // * check if username and password are both greater than 8
  //   * if not, reject with { message: 'USERNAME PASSWORD TOO SHORT' }
  // * check if user with same username already exists
  //   * if not, reject with { message: 'USERNAME ALREADY EXISTS' }
  // * salt and hash using bcrypt's sync functions
  //   * https://www.npmjs.com/package/bcryptjs#usage---sync
  // * if registration is successfull, fufill with the newly created user
  if (username.length < 8 || password.length < 8) {
    throw { message: "USERNAME PASSWORD TOO SHORT" };
  }
  if (await User.findOne({ username: username })) {
    throw { message: "USERNAME ALREADY EXISTS" };
  }
  const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  const newUser = User({
    _id: new mongoose.Types.ObjectId(),
    username: username,
    email: email,
    password: hash,
  });
  await newUser.save();
  return newUser;
  // end TODO
};

const login = async (username, password) => {
  // TODO: implement login
  // * find a user with a matching username
  // * if username isn't found, reject with { message: "USER NOT FOUND" }
  // * use bcrypt's sync functions to check if passwords match
  // * https://www.npmjs.com/package/bcryptjs#usage---sync
  // * if passwords mismatch, reject w/ { message: "PASSWORDS DO NOT MATCH" }
  // * however, if passwords match, fulfill with found user
  const user = await User.findOne({ username: username });
  if (!user) {
    throw { message: "USER NOT FOUND" };
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw { message: "PASSWORDS DO NOT MATCH" };
  }
  return user;
  // end TODO
};

export { startAuthenticatedSession, endAuthenticatedSession, register, login };
