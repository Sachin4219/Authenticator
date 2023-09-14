import jwt_decode from "jwt-decode";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { Response } from "../types/response.js";

export const register = async (req, res) => {
  console.log("Here", req);
  const { password, email } = req.body;
  const serviceResponse = { ...Response };
  try {
    // Find if user already exists or not
    const foundUserEmail = await User.findOne({ email });
    // If user already exists
    if (foundUserEmail) {
      serviceResponse.success = false;
      serviceResponse.msg = "Email is already registered";
      res.status(409).json(serviceResponse);
    } else {
      // Create hash
      const hash = await bcrypt.hash(password, 10);
      // console.log("Hash created", hash)

      const newUser = new User({
        password: hash,
        email,
      });
      await newUser.save();

      serviceResponse.success = true;
      serviceResponse.msg = "User registered successfully";
      serviceResponse.response = {
        email: newUser.email,
        token: generateToken(newUser),
      };

      res.status(201).json(serviceResponse);
    }
  } catch (error) {
    serviceResponse.msg = "Failed to register user";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  const serviceResponse = { ...Response };
  try {
    const foundUser = await User.findOne({ email });
    const hash = foundUser.password;
    bcrypt.compare(password, hash, (err, result) => {
      if (err) console.log(err);
      else {
        if (result) {
          serviceResponse.response = {
            email: foundUser.email,
            token: generateToken(foundUser),
          };
          serviceResponse.success = true;
          serviceResponse.msg = "User logged in successfully";

          res.status(200).json(serviceResponse);
        } else {
          // console.log("Password Does not match");
          serviceResponse.msg = "Password does not match (Invalid credentials)";
          res.status(401).json(serviceResponse);
        }
      }
    });
  } catch (error) {
    serviceResponse.msg = "Failed to login user";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const check_auth = (req, res, next) => {
  console.log("Cheking Auth");
  const serviceResponse = { ...Response };
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, "trymeanddie");
    req.userData = decoded;
    next();
  } catch (error) {
    serviceResponse.msg = "Unauthorized Access";
    serviceResponse.response = { isVerified: false };
    return res.status(401).json(serviceResponse);
  }
};

export const generateToken = (user) => {
  console.log(user);
  return jwt.sign({ email: user.email }, "trymeanddie", {
    expiresIn: "240min",
  });
};

export const signupGoogle = async (req, res) => {
  const { token } = req.body;
  const userObject = jwt_decode(token);
  const serviceResponse = { ...Response };

  try {
    const newUser = new User({
      username: userObject.given_name + userObject.family_name,
      email: userObject.email,
    });

    await newUser.save();

    serviceResponse.success = true;
    serviceResponse.msg = "User registered successfully";
    serviceResponse.response = {
      email: newUser.email,
      token: generateToken(newUser),
    };

    res.status(200).json(serviceResponse);
  } catch (error) {
    console.log(error);
    serviceResponse.msg = "Failed to register user";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const loginGoogle = (req, res) => {
  const serviceResponse = { ...Response };
  const { token } = req.body;
  const userObject = jwt_decode(token);
  try {
    const user = {
      username: userObject.given_name + userObject.family_name,
      email: userObject.email,
    };
    serviceResponse.success = true;
    serviceResponse.msg = "User logged in successfully";
    serviceResponse.response = {
      email: user.email,
      token: generateToken(user),
    };

    res.status(200).json(serviceResponse);
  } catch (err) {
    console.log(err);
    serviceResponse.msg = "Failed to login user";
    serviceResponse.error = err;
    res.status(500).json(serviceResponse);
  }
};
