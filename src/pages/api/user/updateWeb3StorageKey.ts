import { baseDirectory } from "@/api-config";
import { readFile, writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, web3StorageKey } = query;

  let userConfig = await readFile(
    baseDirectory + `/${userId}/user.json`,
    "utf-8"
  );

  let userConfigParsed = JSON.parse(userConfig.toString());

  userConfigParsed.web3StorageKey = web3StorageKey;

  await writeFile(
    baseDirectory + `/${userId}/user.json`,
    JSON.stringify(userConfigParsed)
  );

  res.status(200).send(userConfigParsed);
}
