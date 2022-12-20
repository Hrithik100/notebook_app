const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET =  process.env.JWT_SECRET;


// create a user using: POST "/api/auth/createuser". Doesn't require Auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    // if there are errors, return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    // check whether the user with the same email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email already exist" });
      }

      const salt =await bcrypt.genSalt(10);
      secPas =await bcrypt.hash(req.body.password, salt);

    //   create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPas,
      });

      const data = {
        user:{
          id: user._id
        }
      }
      const authToken = JWT.sign(data, JWT_SECRET);

      success = true
      res.json({success,authToken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Error occured");
    }
  }
);

// Authenticate a user : POST "/api/auth/login"

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    let success = false

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }    

    const{email,password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        success = false 
        return res.status(400).json({success,error:"Please login with correct credentials"});
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        success = false;
        return res.status(400).json({success,error:"Please login with correct credentials"});
      }

      const data = {
        user:{
          id: user._id
        }
      }
      const authToken = JWT.sign(data, JWT_SECRET);
      success = true;
      res.json({success,authToken});

    }catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error");
    }

  })

// getuser : POST "/api/auth/getuser"

router.post(
  "/getUser",fetchuser,async (req, res) => {
    try{
      userId = req.user.id
      const user = await User.findById(userId).select("-password")
      res.send(user)
    }catch(error){
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  })

module.exports = router;
