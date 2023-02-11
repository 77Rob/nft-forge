// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { createDirectory } from "ImageProcessing/utils";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { body } = req;
  const { layerName, userId } = body;
  const directoryPath = `./src/image-processing/users/${userId}/${layerName}`;
  createDirectory(directoryPath);
  res.status(200).json({ name: "John Doe" });
}
