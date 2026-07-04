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
  // Cloudinary blocks unauthenticated delivery of raw/PDF files by default (account-wide
  // security setting). Uploading raw files with type "authenticated" + a signed delivery
  // URL bypasses that restriction without needing dashboard access.
  const type = resourceType === 'raw' ? 'authenticated' : 'upload';

  const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: resourceType, type }, (error, result) => {
        if (error || !result) return reject(error);
        resolve(result);
      })
      .end(file);
  });

  if (resourceType === 'raw') {
    const url = cloudinary.url(result.public_id, { resource_type: 'raw', type: 'authenticated', sign_url: true });
    return { url, publicId: result.public_id };
  }

  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'image' | 'raw' = 'image'): Promise<void> {
  const type = resourceType === 'raw' ? 'authenticated' : 'upload';
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, type });
}
