import {asyncHandler} from "../utils/asyncHandler.js";

import {ApiError} from "../utils/ApiError.js";


import {User} from '../models/user.models.js';


import { uploadOnCloudinary } from "../utils/cloudnary.js";


import { ApiResponse } from "../utils/ApiResponse.js";

import jsonwebtoken from "jsonwebtoken"

import mongoose from "mongoose";

   

const generateAccessAndRefreshTokens
=async(userId)=>{
  try{
    const user=await User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    
     user.refreshToken=refreshToken
     

     await user.save(
      {validateBeforeSave:false}
     )

     return {accessToken,refreshToken}


  }
  catch(error){
     throw new ApiError(500,"something went wrong")
  }

}




 const registerUser=asyncHandler(async (req,res)=>{
  
  // GET USER DATAILS FROM FRONTEND  //
  //VALIDATION -NOT EMPTY//
  // CHECK IF USER IS ALREADY EXISTS : USERNAME   OR EMAIL //
  // CHECK FOR IMAGES CHECK FOR AVATAR//
  // UPLOAD THEM ON CLOUDINARY ,AVATAR//
  // CREATE USER OBJECT - CREATE ENTRY DB 
  //  REMOVE PASSWORD  AND REFRESH TOKEN FIELD FROM RESPONSE
  //   CHECK FOR USER CREATION
  // RETURN RESPONSE




  
//get user datails from frontend


 const {fullName ,email,username ,password}= req.body
 console.log("email",email)

//   validation not empty

 if([fullName,email,username,password].some((field)=>field ?.trim()==="" )){
  throw new ApiError(400,"All fiels are  required ")
 }
 

 // check if user already exists username , email


const existedUser= await User.findOne({
  $or:[{ username },{ email }]
})

if(existedUser)
  {throw new ApiError(409,"User With email or username is exist ")


}

// console.log(req.body);
// console.log('jjjjjjjjjjjjjjjjjjj');
// console.log(req.files);





// check for images check for avatar

 const avatarLocalPath= req.files?.avatar[0]?.path;


//  const coverImageLocalPath= req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if(req.files && Array.isArray( req.files.coverImage) && req.files.coverImage.length>0){
  coverImageLocalPath=req.files.coverImage[0].path
 }

  if(!avatarLocalPath){
  throw new ApiError (400,"Avatar file is required")
 }


// upload them on cloudinary


const avatar=await uploadOnCloudinary(avatarLocalPath)


const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
  throw new ApiError(400, "Avatar file is required")
}

const user= await User.create({
  fullName,
  avatar:avatar.url,
  coverImage:coverImage?.url||"",
  email,
  password ,
  username :username.toLowerCase()


})

const createdUser= await User.findById(user._id).select("-password -refreshToken")

if(!createdUser){
  throw new ApiError(500, "something went wrong")
}
return res.status(201).json(
  new ApiResponse(200,createdUser,"user registered succesfully !")
)

 




 


  

  
  











    })


const  loginUser=asyncHandler(async (req,res )=>{


// req body = dta 
// username or email
// find the user 
// password check
// access and refresh token 
// send cookie 

const {email,username,password}=req.body

console.log(email)

if(!username && !email){
  throw new ApiError(400, "username or email is required") 
}


const user =await User.findOne({
  $or:[{username},{email}],
})



if(!user){
  throw new ApiError(404, " user not exist")
}

 const isPasswordValid=await user.isPasswordCorrect(password)

 if(!isPasswordValid){
  throw new ApiError(401,"Invalid User credentials ")
 }

 const {accessToken,refreshToken}=await  generateAccessAndRefreshTokens(user._id)
//  console.log(accessToken);
 


 const loggedInUser=await User.findById(user._id).select("-password -refreshToken") 



 const options={
  httpOnly:true,
  secure:true,


 }

 return res
 .status(200)
 .cookie("accesstoken",accessToken,options)
 .cookie("refreshToken",refreshToken,options)
 .json(
 new ApiResponse(200,
  {
    user:loggedInUser,accessToken,refreshToken
  },
  "user logged in success fully"
 )

 )


}) 

const logOutUser=asyncHandler(async(req,res)=>{

  await User.findByIdAndUpdate(req.user._id,{
  $unset:{refreshToken:1} /// this remove the field
   
 },
 {
  new:true
 }

)

const options={
  httpOnly:true,
  secure:true,
 }

 return res
 .status(200)
 .clearCookie("accessToken",options)
 .clearCookie("refreshToken",options)
 .json (new ApiResponse(200,{},"User logged out"))




   


})


const refreshAccessToken=asyncHandler(async(req,res)=>{
  const incomingRefreshToken=  req.cookies.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
     throw new ApiError(401,"unothorised request" )
  }


  
  try {
    const decodedToken=jwt.verify(
      incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
    )
  
  const user= await User.findById(decodedToken?._id)
  
  if(!user){
    throw new ApiError(401,"invalid refresh token")
  }
  if(incomingRefreshToken!==user?.refreshToken){
   throw new ApiError(401,"Refresh token is expired or used") 
  }
  const options={
    httpOnly:true,
    secure:true,
  
  }
   const{accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",newrefreshToken,options)
   .json(new ApiResponse(200,{accessToken,refreshToken:newrefreshToken},
    "Access token refreshed succesfullly"
  
   ))
  } catch (error) {
    throw new ApiError(401,error?.message)||"invalid refresh token"
  }


})





export {registerUser,loginUser,logOutUser,refreshAccessToken}