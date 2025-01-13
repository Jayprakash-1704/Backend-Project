const asyncHandler=(requestHandler)=>{
  return  (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err)=>next(err)) 
    }
}

export {asyncHandler} 


// const asyncHandler = (requestHandler) => {
//   return async (req, res, next) => {
//     try {
//       await requestHandler(req, res, next);
//     } catch (err) {
//       next(err); // Pass error to the error handling middleware
//     }
//   };
// };

// export { asyncHandler };

















// const asyncHandler=(fn)=> async (req,res,next)=>{
//     try{
//        await fn(req,req,next)
//     }
//     catch(error){
//         res.status(err.code||500).json({
//             success:false,
//             message:err.message
//         })
//     }
// } 