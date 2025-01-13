import formidable from 'formidable';
import fs from 'fs';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import Imagetracer from 'imagetracerjs'; // Import imagetracerjs
import { createCanvas, loadImage } from 'canvas'; // Import canvas' loadImage and createCanvas

// Set canvas to be available globally for Imagetracerjs
Imagetracer.Image = createCanvas;  // Make the Image object available to Imagetracerjs

export const config = {
  api: {
    bodyParser: false,
  },
};

// Function to convert images to supported formats using sharp
const convertImage = async (fileBuffer, outputFormat) => {
  try {
    const convertedBuffer = await sharp(fileBuffer)
      .toFormat(outputFormat)
      .toBuffer();
    return convertedBuffer;
  } catch (error) {
    throw new Error('Error converting the image with Sharp');
  }
};

// Function to convert images to SVG using imagetracerjs (for raster-to-vector conversion)
const convertToSvg = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    // Convert the image buffer to a Data URL (base64)
    const base64Image = fileBuffer.toString('base64');
    const dataURL = `data:image/png;base64,${base64Image}`;

    // Load image using canvas (create an image instance)
    loadImage(dataURL)
      .then((image) => {
        // Use Imagetracer to trace the image and convert to SVG
        Imagetracer.imageToSVG(image, (svgContent) => {
          if (svgContent) {
            resolve(svgContent);
          } else {
            reject(new Error('Error converting image to SVG'));
          }
        });
      })
      .catch((err) => {
        reject(new Error('Error loading image for SVG conversion: ' + err.message));
      });
  });
};

// Function to convert images to ICO format using png-to-ico
const convertToIco = (fileBuffer) => {
  return pngToIco(fileBuffer)
    .then((icoBuffer) => icoBuffer)
    .catch(() => {
      throw new Error('Error converting image to ICO');
    });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      if (!files.images || !Array.isArray(files.images)) {
        return res.status(400).json({ error: 'Please upload images' });
      }

      const { types } = fields;

      const validFormats = [
        'jpeg',
        'png',
        'webp',
        'gif',
        'tiff',
        'bmp',
        'svg',
        'ico',
      ];

      // Validate target image types
      if (types.filter((type) => !validFormats.includes(type)).length > 0) {
        return res.status(400).json({
          error:
            'Invalid target type. Supported formats: jpeg, png, webp, gif, tiff, bmp, svg, ico.',
        });
      }

      try {
        // Loop through uploaded images and process each
        const conversionPromises = files.images.map(async (imageFile, index) => {
          const fileBuffer = fs.readFileSync(imageFile.filepath);
          const targetType = types[index];

          let convertedBuffer;

          // Convert based on the requested format
          if (targetType === 'svg') {
            convertedBuffer = await convertToSvg(fileBuffer);
          } else if (targetType === 'ico') {
            convertedBuffer = await convertToIco(fileBuffer);
          } else {
            convertedBuffer = await convertImage(fileBuffer, targetType);
          }

          const base64Image = convertedBuffer.toString('base64');
          return base64Image;
        });

        // Wait for all images to be processed
        const convertedImages = await Promise.all(conversionPromises);

        res.status(200).json(convertedImages);
      } catch (error) {
        console.error('Error during image conversion:', error);
        res.status(500).json({ error: 'Error during image conversion' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
