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
import { readFile, writeFile } from "fs/promises";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  let config = getConfig({ userId, collectionId });
  const directoryImages =
    baseDirectory + `/${userId}/collections/${collectionId}/generated`;

  const attributeMetadataDirectory =
    baseDirectory +
    `/${userId}/collections/${collectionId}/attributeMetadata.json`;

  const metadataFile =
    baseDirectory + `/${userId}/collections/${collectionId}/metadata.json`;

  let attributeMetadata = JSON.parse(
    await readFile(attributeMetadataDirectory, "utf8")
  );
  console.log(attributeMetadata);
  const generatedImages = (await readDirectory(directoryImages)).map(
    (image) => `${directoryImages}/${image}`
  );

  attributeMetadata = attributeMetadata.filter((metadata: any) => {
    return generatedImages.includes(metadata.image);
  });

  config.metadata = attributeMetadata.map((metadata: any) => {
    return {
      image: config.ipfsUrlImages
        ? `${config.ipfsUrlImages}/${metadata.fileName}`
        : metadata.image,
      description: config.description,
      name: metadata.fileName.split(".")[0],
      attributes: metadata.attributes,
    };
  });

  await writeFile(metadataFile, JSON.stringify(config.metadata));

  await setConfig({ userId, collectionId, newConfig: config });

  res.status(200).send(config.metadata);
}
