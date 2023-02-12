import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";
import { createDirectory } from "@/utils/utils";

export default async function handler(
  req: NextApiRequest & { files: Express.Multer.File[] },
  res: NextApiResponse
) {
  const { query } = req;

  let directoryPath = `./public/data/${query.userId}/layers/${query.layerId}`;
  createDirectory(directoryPath);
  console.log(directoryPath);
  let form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: directoryPath,
    keepExtensions: true,
    maxFields: 0,
  });

  return await new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files: any) => {
      if (err) {
        return reject(err);
      }

      const images = Object.values(files).map((file: any) => {
        return {
          name: file.name,
          path: file.path,
        };
      });
      return resolve(res.status(200).send({ images: images }));
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
