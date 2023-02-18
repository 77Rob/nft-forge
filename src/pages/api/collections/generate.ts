import { baseDirectory } from "@/api-config";
import {
  readDirectory,
  createDirectory,
  refreshConfig,
  setConfig,
  getConfig,
} from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { generateImages } from "@/utils/generate";
import { CollectionType, isCollection } from "@/types/config.dto";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  const config = getConfig({ userId, collectionId });

  const directoryImages =
    baseDirectory + `/${userId}/collections/${collectionId}/generated`;
  const directoryAttributeMetadata =
    baseDirectory + `/${userId}/collections/${collectionId}/`;

  await createDirectory(directoryImages);

  const generated = await generateImages({
    directoryImages,
    directoryAttributeMetadata,
    amount: 100,
    width: config.width || 500,
    height: config.width || 500,
    layers: config.layers,
  });
  const generatedImages = await readDirectory(directoryImages);

  await refreshConfig({ userId, collectionId });
  res
    .status(200)
    .send(
      generatedImages.map(
        (image) =>
          `/data/${userId}/collections/${collectionId}/generated/${image}`
      )
    );
}
