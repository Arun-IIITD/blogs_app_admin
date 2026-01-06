import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { generateToken } from "../utils/generateToken.js";
import User from "../models/user.model.js";


const registerUser = asyncHandler(async(req,res) => {

    const {name, email , password} = req.body;  
    console.log("regis",req.body)

    const existed_user = await User.findOne(
        {email}
    ); // checking for existing user

    if (existed_user){
        throw new ApiError(409, "User already exist")
    }

    const user = await User.create({
        name,
        email,
        password
    });

    const token = generateToken(user._id);

    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email
    }

    return res
    .status(201)
    .json(
        new ApiResponse
        (200,
            {user : userResponse,
            token
            },
            'register sucesfully')
    )
})

const loginUser = asyncHandler(async(req,res) => {

    //req body -- data
    //username or email
    //find user
    //password check
    //access and refresh token
    //send cookies
    //return res


    const {email, password} = req.body;
    console.log("login",req.body);

    if (!email || !password){
        throw new ApiError(400,"email and password is required")
    }

    //finding user related to name and email
    const user = await User.findOne(
        {email}
    )

    if (!user){
        throw new ApiError(404,`user does not exist related to ${email}`)
    }


    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword){
        throw new ApiError(401,"password is wrong")
    }

    const token = generateToken(user._id);

    const userResponse = {
        _id: user._id,
        name:  user.name,
        email: user.email,
    };

    return res
    .status(200)
    .json(
  new ApiResponse(
    200,

    {
      user: userResponse,
      token
    },
    "Login successful"
  )
  );

});




const getProfile = asyncHandler(async (req, res) => {
  // req.user is set by verifyJWT middleware
  return res.status(200).json(
    new ApiResponse(
      200,
      req.user,
      "User profile fetched successfully"
    )
  );
});


const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
     .clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
  
    .json(new ApiResponse(200, null, "Logged out successfully"));
});




export {registerUser, loginUser, getProfile, logoutUser}