import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadToCloudinary(
  file: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' = 'image'
): Promise<{ url: string; publicId: string }> {
  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      })
      .end(file);
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}
