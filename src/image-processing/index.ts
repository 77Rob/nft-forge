import sharp from "sharp";

const main = async () => {
  const imageOne = await sharp("./text_rgba1.png").resize({
    width: 200,
    height: 200,
  });

  const imageTwo = await sharp("./text_rgba2.png").resize({
    width: 200,
    height: 200,
  });

  imageOne
    .composite([{ input: await imageTwo.toBuffer() }])
    .toFile("text_rgba4.png");
};

main();
