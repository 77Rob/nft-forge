import { refreshConfig, saveConfig } from "@/utils/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";
import { createDirectory, getConfig, packFiles } from "@/utils/utils";
import { baseDirectory } from "@/api-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId, layerId } = query;
  const layersPath =
    baseDirectory + `/${userId}/collections/${collectionId}/layers`;
  let directoryPath = layersPath + `/${layerId}/`;

  createDirectory(directoryPath);
  console.log(directoryPath);
  let form = new formidable.IncomingForm({
    multiples: true,
    filename: (name, ext) => {
      return name + ext;
    },
    uploadDir: directoryPath,
    keepExtensions: true,
    maxFields: 0,
  });

  await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        return reject(res.status(500).send(err));
      }

      const images = Object.values(files).map((file: any) => {
        return {
          name: file.name,
          path: file.path,
        };
      });
      return resolve({ images: images });
    });
  });

  const config = await refreshConfig({ collectionId, userId });

  res.status(200).send({ config });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
