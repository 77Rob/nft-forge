import fs from "fs";
import { baseDirectory } from "@/api-config";
import { createDirectory, getConfig, refreshConfig } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { collectionId, layerName, userId } = req.query;
  const layerDirectory =
    baseDirectory +
    `/${userId}/collections/${collectionId}/layers/${layerName}`;

  await createDirectory(layerDirectory);

  await refreshConfig({ userId, collectionId });

  res.status(200).send({ message: "Layer created" });
}
