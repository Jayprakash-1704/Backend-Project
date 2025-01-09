import { v2 as cloudinary } from "cloudinary";

import fs from "fs"


cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_API_KEY,
        api_secret:process.env.CLOUDINARY_API_SECRET 
    });


    const uploadOnCloudinary=async(localFilePath)=>{
        try{
            if(!localFilePath) return null

            //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type:"auto"})

        // console.log('File uplaoded on cloudinary succesfully',response.url)
        fs.unlinkSync(localFilePath )
            return response
        }

        // file has been uploaded

        
        catch(error){
        fs.unlinkSync(localFilePath)  ///remove the temprory saved file as the  update opration is failed
        return null;
        }
    }

    export {uploadOnCloudinary}

