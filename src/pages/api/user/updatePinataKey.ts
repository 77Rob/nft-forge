import { baseDirectory } from "@/api-config";
import { readFile, writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, pinataKey } = query;
  console.log(userId, pinataKey);
  let userConfig = await readFile(
    baseDirectory + `/${userId}/user.json`,
    "utf-8"
  );
  console.log(userConfig);
  let userConfigParsed = JSON.parse(userConfig.toString());

  userConfigParsed.pinataKey = pinataKey;

  await writeFile(
    baseDirectory + `/${userId}/user.json`,
    JSON.stringify(userConfigParsed)
  );

  res.status(200).send(userConfigParsed);
}
