import { refreshBasicConfig, refreshConfig, saveConfig } from "@/utils/utils";
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
  const { userId, collectionId } = query;
  const directoryPath =
    baseDirectory + `/${userId}/basic_collections/${collectionId}/images`;
  console.log("directoryPath");
  console.log(directoryPath);
  await createDirectory(directoryPath);

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

  const config = await refreshBasicConfig({ collectionId, userId });

  res.status(200).send({ config });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
