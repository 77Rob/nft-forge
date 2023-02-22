import { baseDirectory } from "@/api-config";
import { readDirectory } from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;
  const directoryPath = baseDirectory + `/${userId}/basic_collections`;
  try {
    const collections = await readDirectory(directoryPath);
    res
      .status(200)
      .send(collections.filter((collection) => collection !== "config.json"));
  } catch (err) {
    res.status(500).send({ message: err });
  }
}
