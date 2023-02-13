import fs from "fs";
import { baseDirectory } from "@/api-config";
import { refreshConfig } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { collectionId, layerName, userId, imageName } = req.query;
  const imagePath =
    baseDirectory +
    `/${userId}/collections/${collectionId}/layers/${layerName}/${imageName}`;

  await fs.unlink(imagePath, async (err) => {
    if (err) {
      return res.status(500).send({ message: "Image not deleted", error: err });
    }
    await refreshConfig({ userId, collectionId });

    return res.status(200).send({ message: "Image deleted" });
  });
}
