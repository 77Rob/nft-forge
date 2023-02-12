import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteDirectory } from "@/utils/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, layerId } = query;
  const directoryPath = `./public/image-processing/${userId}/${layerId}`;
  await deleteDirectory(directoryPath);

  const layers: string[] = await fs.promises.readdir(directoryPath);

  if (layers.includes(`${layerId}`)) {
    res.status(400).send({ message: "delete failed" });
  }

  res.status(200).send({ message: "delete success" });
}
