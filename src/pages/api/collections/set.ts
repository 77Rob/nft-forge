import { NextApiRequest, NextApiResponse } from "next";
import { setConfig } from "@/utils/utils";
import { isConfig } from "@/api-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  console.log(query);
  const config = query.config;
  const newConfig = JSON.parse(config as string);
  console.log(config);
  console.log(newConfig);

  if (isConfig(newConfig)) {
    const updatedConfig = await setConfig({ collectionId, userId, newConfig });
    res.status(200).send({
      updatedConfig,
    });
  }
  res.status(400).send({ message: "bad config" });
}
