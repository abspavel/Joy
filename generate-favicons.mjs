import sharp from 'sharp';
import fs from 'fs';
import pngToIco from 'png-to-ico';
import path from 'path';

async function run() {
  const imagePath = path.join(process.cwd(), 'public/joy-photo-transparent.png');
  const buffer = fs.readFileSync(imagePath);
  
  console.log('Generating from:', imagePath);
  
  // Crop the image to a square, focusing on the top (face area)
  // Sharp can crop intelligently or using gravity.
  // The original image is tall. Gravity.north will focus on the head/face area.
  const cropped = sharp(buffer)
    .resize(512, 512, {
      fit: 'cover',
      position: 'top' // Focus on the top part of the portrait
    })
    // Let's add a background if we want, or keep it transparent?
    // Favicons often look better with a slight solid background if the icon is meant to be visible on dark/light themes,
    // but the instruction didn't specify. I'll just keep it as is (transparent).
  
  // Generate pngs
  await cropped.clone().resize(16, 16).png().toFile('public/favicon-16x16.png');
  await cropped.clone().resize(32, 32).png().toFile('public/favicon-32x32.png');
  await cropped.clone().resize(48, 48).png().toFile('public/favicon-48x48.png');
  await cropped.clone().resize(180, 180).png().toFile('public/apple-touch-icon.png');
  await cropped.clone().resize(192, 192).png().toFile('public/android-chrome-192x192.png');
  await cropped.clone().resize(512, 512).png().toFile('public/android-chrome-512x512.png');
  
  // Generate favicon.ico (16, 32, 48 combined)
  const icoBuffer = await pngToIco([
    'public/favicon-16x16.png',
    'public/favicon-32x32.png',
    'public/favicon-48x48.png'
  ]);
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  
  // Clean up 48x48 if not needed anymore
  fs.unlinkSync('public/favicon-48x48.png');
  
  console.log('Successfully generated all favicons.');
}
run().catch(console.error);
