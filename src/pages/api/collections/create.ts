import { createDirectory } from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { baseDirectory } from "@/api-config";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionName } = query;
  const directoryPath = baseDirectory + `/${userId}/${collectionName}`;
  await createDirectory(directoryPath);
}
