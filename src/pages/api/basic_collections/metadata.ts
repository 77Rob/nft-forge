import { baseDirectory } from "@/api-config";
import { getBasicConfig, readDirectory, setBasicConfig } from "@/utils/utils";
import { writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  let config = getBasicConfig({ userId, collectionId });
  const directoryImages =
    baseDirectory + `/${userId}/basic_collections/${collectionId}/images`;

  const collectionImages = (await readDirectory(directoryImages)).map(
    (image) => ({ path: `${directoryImages}/${image}`, image: image })
  );

  const metadataFile =
    baseDirectory +
    `/${userId}/basic_collections/${collectionId}/metadata.json`;
  console.log("collectionImages");
  console.log(collectionImages);
  config.metadata = collectionImages.map((metadata: any) => {
    return {
      image: config.ipfsUrlImages
        ? `${config.ipfsUrlImages}/${metadata.image}`
        : metadata.path,
      description: config.description,
      name: metadata.image.split(".")[0],
    };
  });

  await writeFile(metadataFile, JSON.stringify(config.metadata));

  await setBasicConfig({ userId, collectionId, newConfig: config });

  res.status(200).send(config.metadata);
}
