import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";


const Router = express.Router();

//models
import { UserModel } from "../../database/user";

//validation
import { ValidateSignup, ValidateSignin } from "../../validation/auth";

/*
Router     /signup
descrip     signup with email and password
params      none
access      public
method      post
*/

Router.post("/signup", async(req,res) => {
  try {

    await ValidateSignup(req.body.credentials);

    await UserModel.findEmailAndPhone(req.body.credentials);

    //database
    const newUser = await UserModel.create(req.body.credentials);

    //jwt Auth Token
    const token = newUser.generateJwtToken()

    return res.status(200).json({token});

  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


/*
Router     /signin
descrip     signin with email and password
params      none
access      public
method      post
*/

Router.post("/signin", async(req,res) => {
  try {

    await ValidateSignin(req.body.credentials);

    const user = await UserModel.findByEmailAndPassword(
      req.body.credentials
    );

    //jwt Auth Token
    const token = user.generateJwtToken()

    return res.status(200).json({token, status: "Success"});

  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});


/*
Router     /google
descrip     google signin
params      none
access      public
method      get
*/

Router.get("/google", passport.authenticate("google",{
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ],
})
);

/*
Router     /google/callback
descrip     google signin callback
params      none
access      public
method      get
*/

Router.get("/google/callback", passport.authenticate("google",{failureRedirect: "/"}),
(req,res) => {
  return res.json({token: req.session.passport.user.token});
}
);



export default Router;
