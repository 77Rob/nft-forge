import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;
  const directoryPath = `./src/image-processing/users/${userId}`;
  const layerNames: string[] = await fs.promises.readdir(directoryPath);

  res.status(200).send({
    layers: layerNames.map((layer: string) => {
      return {
        name: layer,
      };
    }),
  });
}
