import sharp from "sharp";
import fs from "fs";
import { LayerType } from "@/types/config.dto";

interface GenerateImagesProps {
  directoryImages: string;
  directoryAttributeMetadata?: string;
  amount: number;
  width: number;
  height: number;
  layers: LayerType[];
}

// Define a function that takes in the parameters and returns a promise of an array of generated images
export async function generateImages({
  directoryImages,
  directoryAttributeMetadata,
  amount,
  width,
  height,
  layers,
}: GenerateImagesProps): Promise<sharp.Sharp[]> {
  let generatedImages: sharp.Sharp[] = [];
  const metadata: any = [];
  for (let i = 0; i < amount; i++) {
    let fileName = `${i}.png`;
    let filePath = `${directoryImages}/${fileName}`;

    metadata[i] = { fileName: fileName, image: `${filePath}`, attributes: [] };

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

        let layerImageName = layer.images[index].name;
        metadata[i].attributes.push({
          [layer.name]: layerImageName.split(".")[0],
        });

        // Resize or crop the overlay image to fit the original image
        let resizedLayerImage = await sharp(layerImage)
          .resize(width, height, { fit: "contain" })
          .toBuffer();

        // Add the overlay image to the array with a blend mode
        overlayImages.push({ input: resizedLayerImage, blend: "over" });
      }
    }

    // Composite the overlay images with the original image
    image = image.composite(overlayImages as sharp.OverlayOptions[]);

    generatedImages.push(image);

    await image.toFile(filePath);
  }
  if (directoryAttributeMetadata) {
    await fs.writeFile(
      `${directoryAttributeMetadata}/attributeMetadata.json`,
      JSON.stringify(metadata),
      (err) => {
        if (err) {
          console.log("Error writing attribute metadata");
          console.error(err);
        }
      }
    );
  }
  // Return the array of generated images
  return generatedImages;
}
