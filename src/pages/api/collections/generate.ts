import { baseDirectory, isConfig } from "@/api-config";
import { readDirectory, createDirectory } from "@/utils/utils";
import { NextApiResponse } from "next";
import { NextApiRequest } from "next";
import { generateImages } from "@/utils/generate";
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { config, userId, collectionId } = query;

  const newConfig = JSON.parse(config as string);
  console.log(newConfig.layers);

  if (!isConfig(newConfig)) {
    return res.status(400).send({ message: "bad config" });
  }

  const directory =
    baseDirectory + `/${userId}/collections/${collectionId}/generated/`;

  await createDirectory(directory);

  const generated = await generateImages({
    directory,
    amount: 100,
    width: newConfig.width || 500,
    height: newConfig.width || 500,
    layers: newConfig.layers,
  });

  return res.status(200).send(generated);
}
