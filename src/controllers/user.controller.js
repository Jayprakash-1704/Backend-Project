 import {asyncHandler} from "../utils/asyncHandler.js"

import {ApiError} from "../utils/ApiError.js"


import {User} from '../models/user.models.js'


import { uploadOnCloudinary } from "../utils/cloudnary.js"

import { ApiResponse } from "../utils/ApiResponse.js"



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


 const {fullname ,email,username ,password}= req.body
 console.log("email",email)

//   validation not empty

 if([fullname,email,password,username].some((field)=>field ?.trim()==="" )){
  throw new ApiError(400,"All fiels are   required ")
 }
 

 // check if user already exists username , email


const existedUser= User.findOne({
  $or:[{ username },{ email }]
})

if(existedUser){throw new ApiError(409,"User With email or username is exist ")
}

// check for images check for avatar

 const avatarLocalPath= req.files?.avatar[0]?.path;


 const coverImageLocalPath= req.files?.coverImage[0]?.path;

 if(!avatarLocalPath){
  throw new ApiError (400,"Avatar file is required")
 }


// upload them on cloudinary


const avatar=await uploadOnCloudinary(avatarLocalPath)


const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
  throw new ApiError(400, "Avatar file is required")
}

const user= await  User.create({
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




export {registerUser}