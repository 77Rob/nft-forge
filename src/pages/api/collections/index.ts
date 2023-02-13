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
  const directoryPath = baseDirectory + `/${userId}/collections`;
  try {
    const collections = await readDirectory(directoryPath);
    res.status(200).send(collections);
  } catch (err) {
    res.status(500).send({ message: err });
  }
}
