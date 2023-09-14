import express from "express";
import { Response } from "../types/response.js";
const router = express.Router();

import { loginGoogle, signupGoogle } from "../controllers/user.js";

import {
  register,
  login,
  generateToken,
  check_auth,
} from "../controllers/user.js";

//Login using google
router.post("/login", loginGoogle);

//Signup using google
// router.post("signupgoogle", signupGoogle);

//Register a new user
router.post("/register", register);

//Login a user
router.post("/loginemail", login);

//Check if user is authenticated
router.get("/check_auth", check_auth, (req, res) => {
  const serviceResponse = { ...Response };
  serviceResponse.success = true;
  serviceResponse.response = {
    isVerified: true,
    authorData: req.authorData,
  };

  return res.status(200).json(serviceResponse);
});

export default router;
