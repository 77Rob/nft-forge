import { createDirectory } from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;
  const directoryPath = `./src/data/${userId}`;
  await createDirectory(directoryPath);
}
