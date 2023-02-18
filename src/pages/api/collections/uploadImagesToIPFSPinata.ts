import {
  packFiles,
  readDirectory,
  getConfig,
  saveConfig,
  refreshConfig,
} from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";
import { baseDirectory, configFileName } from "@/api-config";
import fs from "fs";
import { CollectionType } from "@/types/config.dto";
import { readFile } from "fs/promises";
import FormData from "form-data";
import rfs from "recursive-fs";
import basePathConverter from "base-path-converter";
import got from "got";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { userId, collectionId } = query;
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const directoryPath = `./public/data/${userId}/collections/${collectionId}/generated`;

  let config: CollectionType = await getConfig({ collectionId, userId });
  let userConfig = await readFile(
    baseDirectory + `/${userId}/user.json`,
    "utf-8"
  );

  let userConfigParsed = JSON.parse(userConfig.toString());

  var status = 0;
  try {
    const { dirs, files } = await rfs.read(directoryPath);
    let data = new FormData();
    for (const file of files) {
      data.append(`file`, fs.createReadStream(file), {
        filepath: basePathConverter(directoryPath, file),
      });
    }
    const response = await got(url, {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; `,
        Authorization: userConfigParsed.pinataKey,
      },
      body: data,
    }).on("uploadProgress", (progress) => {
      console.log(progress);
    });
    console.log(JSON.parse(response.body));
  } catch (error) {
    console.log("error");
    console.log(error);
  }

  //   config.ipfsUrlImages =
  return res.status(200).send({
    config,
  });
}
