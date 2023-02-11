import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";
import { createDirectory } from "@/image-processing/utils";
import multer from "multer";

const upload = multer();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const files = req.files as Express.Multer.File[];
  let directoryPath = `./public/image-processing/${query.userId}/${query.layerId}/`;

  let form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: "./public/image-processing",
    maxFields: 0,
  });

  form.parse(req, async (err, fields, files: any) => {
    console.log(files);
    for (let i = 0; i < files.myFiles.length; i++) {
      const fileBlob = new Blob([files.myFiles[i]], { type: "image/png" });
      save;
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
