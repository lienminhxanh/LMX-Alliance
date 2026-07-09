import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

async function main() {
  const image1 = 'public/images/temp/intro_1-scaled.jpeg';
  const image2 = 'public/images/temp/whatsapp-image-2026-01-30-at-4-59-41-pm-1-500x500-1.webp';
  
  console.log('Uploading image 1...');
  const res1 = await cloudinary.uploader.upload(image1, { folder: 'lmx-migration/projects' });
  console.log('Uploaded image 1:', res1.secure_url);

  console.log('Uploading image 2...');
  const res2 = await cloudinary.uploader.upload(image2, { folder: 'lmx-migration/projects' });
  console.log('Uploaded image 2:', res2.secure_url);

  console.log('Updating DB...');
  const projects = await prisma.project.findMany();
  for (const proj of projects) {
    if (proj.images && Array.isArray(proj.images)) {
      const updatedImages = proj.images.map((img: any) => {
        if (typeof img === 'string' && img.includes('intro_1-scaled.jpeg')) return res1.secure_url;
        if (typeof img === 'string' && img.includes('whatsapp-image')) return res2.secure_url;
        return img;
      });
      await prisma.project.update({
        where: { id: proj.id },
        data: { images: updatedImages }
      });
      console.log(`Updated project ${proj.id}`);
    }
  }
  console.log('Done updating DB!');
}
main().catch(console.error).finally(() => prisma.$disconnect());
