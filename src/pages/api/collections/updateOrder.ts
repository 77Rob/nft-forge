import { NextApiRequest, NextApiResponse } from "next";
import { refreshConfig, saveConfig } from "@/utils/utils";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId, order } = query;
  const newOrder = query["order[]"];
  if (typeof newOrder !== "string" && typeof order !== undefined) {
    const config = await refreshConfig({ collectionId, userId, newOrder });
    res.status(200).send({ config });
  }
  res.status(400).send({ message: "bad order" });
}
