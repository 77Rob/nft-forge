import {
  packFiles,
  readDirectory,
  getConfig,
  saveConfig,
  refreshConfig,
  createDirectory,
  getBasicConfig,
  saveBasicConfig,
} from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { baseDirectory, configFileName } from "@/api-config";
import fs from "fs";
import { CollectionType } from "@/types/config.dto";
import { readFile, writeFile } from "fs/promises";
import FormData from "form-data";
import rfs from "recursive-fs";
import basePathConverter from "base-path-converter";
import got from "got";
import { Filelike, getFilesFromPath, Web3Storage } from "web3.storage";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  const metadataFilePath = `./public/data/${userId}/basic_collections/${collectionId}/metadata.json`;
  const metadataDirectory = `./public/data/${userId}/basic_collections/${collectionId}/metadata/`;

  let metadata = JSON.parse(await readFile(metadataFilePath, "utf8"));

  await createDirectory(metadataDirectory);

  for (let i = 0; i < metadata.length; i++) {
    await writeFile(
      metadataDirectory + metadata[i].name + ".json",
      JSON.stringify(metadata[i])
    );
  }
  let config: CollectionType = await getBasicConfig({ collectionId, userId });
  let userConfig = await readFile(
    baseDirectory + `/${userId}/user.json`,
    "utf-8"
  );

  let userConfigParsed = JSON.parse(userConfig.toString());
  const client = new Web3Storage({ token: userConfigParsed.web3StorageKey });
  const files = await getFilesFromPath(metadataDirectory);
  const rootCid = await client.put(files as Iterable<Filelike>);
  config.ipfsUrlMetadata = `${rootCid}/metadata`;

  await saveBasicConfig({ collectionId, userId, config });
  res.send({ url: config.ipfsUrlMetadata });
}
