import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
dotenv.config();

cloudinary.config({
  api_key: process.env.CLOUD_KEY,
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUD_SECRET,
  secure: true
});


type ResourceType = "audio" | "video" | "image"
export const fileUpload = async (file: any, name?: string, type: ResourceType = "image", isProfile: boolean = false) => {
    if (!file) return;
    const resource_type = type === "image" ? "image" : "video"
    const public_id = isProfile ? `play_music/user/${name}` : `play_music/${type}/${name}`
    const image = await cloudinary.uploader.upload(file, { resource_type, public_id });
    const data = {
        url: image.secure_url,
        type: image.type,
        width: image.width,
        height: image.height,
        size: image.bytes,
    };
    return data;
};


export const uploadBinary = async (file: any) => {
    const uploadResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
                if (error) {
                    console.error(error);
                    reject('Failed to upload to Cloudinary');
                }
                // Resolve with Cloudinary response for the current file
                resolve(result);
            }
        );
        // End the stream with the file buffer
        uploadStream.end(file.buffer);
    });
    
    return uploadResponse;
};

