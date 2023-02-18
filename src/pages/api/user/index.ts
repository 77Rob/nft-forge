import { baseDirectory } from "@/api-config";
import { readFile, writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;

  const userConfig = await readFile(baseDirectory + `/${userId}/user.json`);

  res.status(200).send(userConfig);
}
