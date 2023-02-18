import fs from "fs";
import { baseDirectory } from "@/api-config";
import { refreshConfig } from "@/utils/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { imagePath } = req.query;
  console.log("IMAGE PATH", imagePath);
  await fs.unlink(`./public${imagePath}`, async (err) => {
    if (err) {
      console.log("ERROR", err);

      return res.status(500).send({ message: "Image not deleted", error: err });
    }

    return res.status(200).send({ message: "Image deleted" });
  });
}
