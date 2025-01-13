export default convertImageFormat = async (images) => {
  const conversionPromises = images.map(async (image) => {
    const { file, type } = image;

    // Ensure the target file extension is valid (e.g., jpeg, png, webp, etc.)
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
    if (!validFormats.includes(type)) {
      throw new Error(`Invalid target type: ${type}`);
    }

    try {
      // Define the output path (same as input, but with a different extension)
      const outputPath = path.join(
        path.dirname(file),
        `${path.basename(file, path.extname(file))}.${type}`
      );

      // Handle image conversion with sharp
      if (type === 'svg') {
        // Special case for SVG conversion: sharp only outputs SVG from input if the input is SVG
        await sharp(file).toFile(outputPath); // SVG to any other format (e.g., PNG, JPEG)
      } else {
        // Convert the image to the desired format
        await sharp(file)
          .toFormat(type) // Convert the image to the desired format
          .toFile(outputPath); // Output the converted image
      }

      console.log(`Image converted: ${file} -> ${outputPath}`);
      return outputPath; // Return the output path after conversion
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
      throw error; // Rethrow the error to handle it outside
    }
  });

  // Wait for all conversions to finish and return the results
  return Promise.all(conversionPromises);
};
