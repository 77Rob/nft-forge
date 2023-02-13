import {
  packFiles,
  readDirectory,
  getConfig,
  saveConfig,
  refreshConfig,
} from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { baseDirectory, configFileName } from "@/api-config";
import fs from "fs";
import { Config } from "@/api-config";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  console.log(query);

  const config: Config = await refreshConfig({ collectionId, userId });
  console.log("CONFIG IS", config);
  res.status(200).send({
    config,
  });
}
