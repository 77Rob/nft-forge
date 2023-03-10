import {
  packFiles,
  readDirectory,
  getConfig,
  saveConfig,
  refreshConfig,
  saveBasicConfig,
  getBasicConfig,
} from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { baseDirectory, configFileName } from "@/api-config";
import fs from "fs";
import { CollectionType } from "@/types/config.dto";
import { readFile } from "fs/promises";
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

  const directoryPath = `./public/data/${userId}/basic_collections/${collectionId}/images`;
  console.log(directoryPath);
  let config: CollectionType = await getBasicConfig({ collectionId, userId });
  let userConfig = await readFile(
    baseDirectory + `/${userId}/user.json`,
    "utf-8"
  );

  let userConfigParsed = JSON.parse(userConfig.toString());

  const client = new Web3Storage({ token: userConfigParsed.web3StorageKey });
  const files = await getFilesFromPath(directoryPath);
  const rootCid = await client.put(files as Iterable<Filelike>);
  config.ipfsUrlImages = `${rootCid}/images`;
  await saveBasicConfig({ collectionId, userId, config });
  res.send({ url: `${rootCid}/images` });
}
