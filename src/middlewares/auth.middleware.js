import { User } from "../models/user.models.js"

import { ApiError } from "../utils/ApiError.js"

import jwt from "jsonwebtoken"

import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")

   

    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
     

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    )

    if (!user) {
      throw new ApiError(401, "invalid access token")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token ")
  }
});












// import { User } from "../models/user.models.js";
// import { ApiError } from "../utils/ApiError.js";
// import jwt from "jsonwebtoken";
// import { asyncHandler } from "../utils/asyncHandler.js";

// // Function to set token in cookies or headers
// const setToken = (res, user) => {
//   const tokenPayload = { id: user._id, email: user.email };
//   const secret = process.env.ACCESS_TOKEN_SECRET;
//   const expiry = "1h"; // Token expiry time

//   // Generate token
//   const token = jwt.sign(tokenPayload, secret, { expiresIn: expiry });

//   // Set token in cookies
//   res.cookie("accessToken", token, {
//     httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
//     secure: process.env.NODE_ENV === "production", // Ensures the cookie is sent over HTTPS in production
//     sameSite: "strict", // Protects against CSRF
//     maxAge: 60 * 60 * 1000, // 1 hour
//   });

//   // Set token in headers
//   res.set("Authorization", `Bearer ${token}`);

//   return token;
// };

// // JWT verification middleware
// export const verifyJWT = asyncHandler(async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "") ||
//       req.query.token;

//     console.log("Token Source:", token ? "Found" : "Not Found");

//     if (!token) {
//       throw new ApiError(401, "Unauthorized request");
//     }

//     // Verify the token
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findById(decodedToken?._id).select(
//       "-password -refreshToken"
//     );

//     if (!user) {
//       throw new ApiError(401, "Invalid access token");
//     }

//     req.user = user;

//     // Optionally, you can set a new token if needed (for refresh)
//     // Example: if you need to refresh the token after the user is verified
//     setToken(res, user);

//     next();
//   } catch (error) {
//     throw new ApiError(401, error?.message || "Invalid access token");
//   }
// });
