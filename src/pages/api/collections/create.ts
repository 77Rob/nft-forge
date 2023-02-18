import { CollectionType } from "@/types/config.dto";
import { saveConfig } from "@/utils/utils";
import fs from "fs";
import { createDirectory } from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { baseDirectory, configFileName } from "@/api-config";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionName } = query;
  const directoryPath =
    baseDirectory + `/${userId}/collections/${collectionName}/`;
  await createDirectory(directoryPath);

  const config: CollectionType = {
    layers: [],
    ipfsHash: "",
    ipfsUrlImages: "",
    ipfsUrlMetadata: "",
    name: `${collectionName}`,
    description: "",
    generated: [],
    image: "",
    width: 500,
    height: 500,
    amount: 100,
  };

  const jsonString = JSON.stringify(config, null, 2);
  const configFilePath = directoryPath + configFileName;

  await fs.writeFile(configFilePath, jsonString, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("JSON file created successfully!");
    }
  });
  res.status(200).send(config);
}
