import sharp from "sharp";
import fs from "fs";

// Define the interface for LayerType
interface LayerType {
  name: string;
  rarity: number;
  id: number;
  images: Image[];
}
interface Image {
  name: string;
  url: string;
}

// Define a function that takes in the parameters and returns a promise of an array of generated images
export async function generateImages({
  directory,
  amount,
  width,
  height,
  layers,
}: {
  directory: string;
  amount: number;
  width: number;
  height: number;
  layers: LayerType[];
}): Promise<sharp.Sharp[]> {
  let generatedImages: sharp.Sharp[] = [];
  for (let i = 0; i < amount; i++) {
    let image = sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    });

    // Create an array of overlay images
    let overlayImages: {
      input: Buffer;
      blend: string;
      top?: number;
      left?: number;
      gravity?: string;
    }[] = [];

    for (let layer of layers) {
      let random = Math.floor(Math.random() * 100);

      if (random <= layer.rarity) {
        let index = Math.floor(Math.random() * layer.images.length);
        let layerImage = "./public/" + layer.images[index].url;

        // Resize or crop the overlay image to fit the original image
        let resizedLayerImage = await sharp(layerImage)
          .resize(width, height, { fit: "contain" })
          .toBuffer();

        // Add the overlay image to the array with a blend mode
        overlayImages.push({ input: resizedLayerImage, blend: "over" });
      }
    }

    // Composite the overlay images with the original image
    image = image.composite(overlayImages);

    generatedImages.push(image);
    let fileName = `image_${i}.png`;
    let filePath = `${directory}/${fileName}`;
    await image.toFile(filePath);
  }

  // Return the array of generated images
  return generatedImages;
}
