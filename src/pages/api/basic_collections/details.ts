import {
  packFiles,
  readDirectory,
  getConfig,
  saveConfig,
  refreshConfig,
  refreshBasicConfig,
} from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { baseDirectory, configFileName } from "@/api-config";
import fs from "fs";
import { CollectionType } from "@/types/config.dto";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;

  const config: CollectionType = await refreshBasicConfig({
    collectionId,
    userId,
  });

  return res.status(200).send({
    config,
  });
}
