import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteDirectory, refreshConfig } from "@/utils/utils";
import { baseDirectory } from "@/api-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, layerId, collectionId } = query;
  const directoryPath =
    baseDirectory + `/${userId}/collections/${collectionId}/layers/${layerId}`;
  await deleteDirectory(directoryPath);

  const layers: string[] = await fs.promises.readdir(directoryPath);

  if (layers.includes(`${layerId}`)) {
    res.status(400).send({ message: "delete failed" });
  }
  await refreshConfig({ collectionId, userId });

  res.status(200).send({ message: "delete success" });
}
