import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import formidable from "formidable";
import { createDirectory } from "@/image-processing/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  let directoryPath = `./public/image-processing/${query.userId}/${query.layerId}/`;

  let form = new formidable.IncomingForm({
    multiples: true,
    // uploadDir: directoryPath,
    // keepExtensions: true,
    // filename: (name, extension) => {
    //   return name + extension;
    // },
  });

  form.parse(req, async (err, fields, files: any) => {
    console.log(fields);
    console.log(files);
    if (err) {
      console.error(err);
    }
    let images: any = [];
    console.log("1");
    for (let file in files) {
      console.log("1");
      if (files[file].size === 0) {
        console.log("No image was uploaded.");
      }
      await fs.writeFile("./file1.png", files.files[0], (err) => {});
      let oldPath = files.files.path;
      let newPath = directoryPath + files[file].name;
      await createDirectory(newPath);
      console.log("oldPath:", oldPath);
      fs.rename(oldPath, newPath, (err) => {
        if (err) {
          console.error(err);
        } else {
          images.push(newPath);
        }
      });
    }
  });
  return await res.status(200).send({
    message: "Images saved successfully.",
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
