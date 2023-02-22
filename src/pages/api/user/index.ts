import fs from "fs";
import { baseDirectory } from "@/api-config";
import { UserType } from "@/types/user.dto";
import { createDirectory } from "@/utils/utils";
import { readFile, writeFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;
  const userConfigPath = baseDirectory + `/${userId}/user.json`;

  if (fs.existsSync(userConfigPath)) {
    const userConfig = await readFile(userConfigPath);
    res.status(200).send(userConfig);
  } else {
    const directoryPath = baseDirectory + `/${userId}`;
    await createDirectory(directoryPath);

    const user: UserType = {
      userId: `${userId}`,
      pinataKey: "",
      web3StorageKey: "",
    };

    const jsonString = JSON.stringify(user, null, 2);

    await fs.writeFile(userConfigPath, jsonString, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("JSON file created successfully!");
      }
    });

    const userConfig = await readFile(userConfigPath);

    res.status(200).send(userConfig);
  }
}
