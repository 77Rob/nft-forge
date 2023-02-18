import { UserType } from "@/types/user.dto";
import { saveConfig } from "@/utils/utils";
import fs from "fs";
import { createDirectory } from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { baseDirectory } from "@/api-config";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId } = query;
  const directoryPath = baseDirectory + `/${userId}`;
  await createDirectory(directoryPath);

  const user: UserType = {
    userId: `${userId}`,
    pinataKey: "",
    web3StorageKey: "",
  };

  const jsonString = JSON.stringify(user, null, 2);
  const configFilePath = directoryPath + "/user.json";

  await fs.writeFile(configFilePath, jsonString, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("JSON file created successfully!");
    }
  });

  res.status(200).send(user);
}
