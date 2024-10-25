import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({
    path : './.env'
});

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinay = async (localFilePath) => {
  try {
    if(!localFilePath) return null;
    // upload file on cloudinay
    const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type : "auto"
    });
    // console.log(`File uploaded successfully`, response);
    fs.unlinkSync(localFilePath); // remove temp folder file after upload on cloud
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the uploaded file if upload operation got failed
    console.log(`File uploading failed on cloudinary`, error);
    return null;
  }
};

// delete object from cloudinary
const deleteFromCloudinay = async (objectname) => {
  try {
    if(!objectname) return null;

    let objectId = getFileNameWithoutExtension(objectname);
    // objectId = 'samples/cloudinary-logo-vector';
    // delete file on cloudinay
    const response = await cloudinary.uploader.destroy(objectId, {resource_type : "image"} );
    // console.log(`File delete successfully`, response);
    return response;
  } catch (error) {
    console.log(`File deleting failed on cloudinary`, error);
    return null;
  }
};

const getFileNameWithoutExtension = (objectfullpath) => {
  // Extract the full file name (with extension)
  const fullFileName = objectfullpath.split('/').pop(); // dia2k0tuxpnbafqnzmc2.png

  // Remove the extension by splitting on the last dot (.)
  const fileNameWithoutExtension = fullFileName.split('.').slice(0, -1).join('.');

  // console.log('fileNameWithoutExtension' , fileNameWithoutExtension); // Outputs: dia2k0tuxpnbafqnzmc2
  return fileNameWithoutExtension;
};

export { uploadOnCloudinay, deleteFromCloudinay }