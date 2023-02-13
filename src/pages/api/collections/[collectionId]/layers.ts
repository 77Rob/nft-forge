import { readDirectory } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { baseDirectory } from "@/api-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;
  const directoryPath = baseDirectory + `/users/${userId}`;
  const layerNames: string[] = await readDirectory(directoryPath);

  res.status(200).send({
    layers: layerNames.map((layer: string) => {
      return {
        name: layer,
      };
    }),
  });
}
