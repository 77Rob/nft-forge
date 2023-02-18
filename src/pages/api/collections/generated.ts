import { baseDirectory } from "@/api-config";
import { readDirectory } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  const directoryPath =
    baseDirectory + `/${userId}/collections/${collectionId}/generated`;

  try {
    const generatedImages = await readDirectory(directoryPath);
    res
      .status(200)
      .send(
        generatedImages.map(
          (image) =>
            `/data/${userId}/collections/${collectionId}/generated/${image}`
        )
      );
  } catch (err) {
    res.status(500).send({ message: err });
  }
}
