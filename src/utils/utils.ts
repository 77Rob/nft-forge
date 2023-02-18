import { baseDirectory, configFileName } from "@/api-config";
import { CollectionType, LayerType } from "@/types/config.dto";
import * as path from "path";
import * as fs from "fs";
import { generateImages } from "./generate";

export const createDirectory = (directoryPath: string) => {
  const directories = directoryPath.split("/");
  let currentPath = "";

  for (const directory of directories) {
    currentPath += directory + "/";

    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
};

export function readDirectory(directoryPath: string): Promise<string[] | []> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (error, files) => {
      if (error) {
        console.error(
          `An error occurred while reading the directory: ${error}`
        );
        resolve([]);
      }

      resolve(files);
    });
  });
}

export const deleteDirectory = (directoryPath: string) => {
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      console.error(`An error occurred while reading the directory: ${error}`);
      return;
    }

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      fs.unlink(filePath, (error) => {
        if (error) {
          console.error(`An error occurred while deleting the file: ${error}`);
          return;
        }
      });
    }

    fs.rmdir(directoryPath, (error) => {
      if (error) {
        console.error(
          `An error occurred while deleting the directory: ${error}`
        );
        return;
      }
    });
  });
};

type Data = { [key: string]: string };

export async function packFiles(dir: string): Promise<Data | undefined> {
  let result: Data = {};
  let files = await fs.promises.readdir(dir);
  let count = files.length;
  if (count === 0) {
    return result;
  }

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let filePath = path.join(dir, file);
    let stats = await fs.promises.stat(filePath);

    if (stats.isDirectory()) {
      let data = await packFiles(filePath);
      result = Object.assign(result, data);
      count--;
      if (count === 0) {
        return result;
      }
    } else {
      result[file] = filePath;
      count--;
      if (count === 0) {
        return result;
      }
    }
  }
}
export async function ensureDirectoryExistence(
  directoryPath: string
): Promise<void> {
  const dirname = path.dirname(directoryPath);
  let dirExists = await new Promise<boolean>((resolve) => {
    fs.exists(dirname, (exists) => {
      resolve(exists);
    });
  });

  if (!dirExists) {
    await ensureDirectoryExistence(dirname);
    await new Promise<void>((resolve, reject) => {
      fs.mkdir(dirname, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }
}

interface GetConfigProps {
  userId: string | string[] | undefined;
  collectionId: string | string[] | undefined;
}

export const getConfig = ({ userId, collectionId }: GetConfigProps) => {
  if (!userId || !collectionId) return null;

  const directoryPath =
    baseDirectory + `/${userId}/collections/${collectionId}/`;
  const configFilePath = directoryPath + configFileName;
  const config = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
  return config;
};

export const saveConfig = ({
  userId,
  collectionId,
  config,
}: {
  userId: string | string[] | undefined;
  collectionId: string | string[] | undefined;
  config: any;
}) => {
  if (!userId || !collectionId) return null;

  const directoryPath =
    baseDirectory + `/${userId}/collections/${collectionId}/`;
  const configFilePath = directoryPath + configFileName;
  const jsonString = JSON.stringify(config, null, 2);

  fs.writeFile(configFilePath, jsonString, (err) => {
    if (err) {
      console.error(err);
    }
  });
};

export async function refreshConfig({
  userId,
  collectionId,
  newOrder,
}: {
  userId: string | string[] | undefined;
  collectionId: string | string[] | undefined;
  newOrder?: string[];
}) {
  if (!userId || !collectionId) return null;
  const config = getConfig({ userId, collectionId });
  if (!config) return null;

  const layersPath =
    baseDirectory + `/${userId}/collections/${collectionId}/layers`;

  let layerOrder: any[] = config.layerOrder || [];

  const layers = await readDirectory(layersPath);

  for (let i = 0; i < layers.length; i++) {
    if (!layerOrder.includes(layers[i])) {
      layerOrder.push(layers[i]);
    }
  }

  for (let i = 0; i < layerOrder.length; i++) {
    if (layerOrder[i] !== undefined && layerOrder[i] !== null) {
      if (!layers.includes(layerOrder[i])) {
        layerOrder.splice(i, 1);
      }
    }
  }

  if (newOrder) {
    layerOrder = newOrder;
  }

  let newConfig = { ...config };
  newConfig.layerOrder = layerOrder;

  const newLayers = await Promise.all(
    layerOrder.map(async (layer: string, i: number) => {
      const layerImages = (await readDirectory(`${layersPath}/${layer}`)) || [];

      const layerAlreadyExists = config.layers.find(
        (l: any) => l.name === layer
      );

      const layerImagesFormatted =
        layerImages.map((image: string) => {
          const imageUrl = `/data/${userId}/collections/${collectionId}/layers/${layer}/${image}`;
          return {
            name: image,
            url: imageUrl,
          };
        }) || [];

      return {
        name: layer,
        rarity: layerAlreadyExists?.rarity || 100,
        images: layerImagesFormatted,
      };
    })
  );
  newConfig.layers = newLayers;
  const previewDirectoryPath =
    baseDirectory + `/${userId}/collections/${collectionId}/preview`;
  createDirectory(previewDirectoryPath);
  console.log("PREVIEW");
  const preview = await generateImages({
    layers: newLayers.filter((l) => l.images.length > 0) as LayerType[],
    directoryImages: previewDirectoryPath,
    amount: 10,
    width: newConfig.width,
    height: newConfig.height,
  });

  const previewImages = await readDirectory(
    baseDirectory + `/${userId}/collections/${collectionId}/preview/`
  );

  const previewImagesFormatted = previewImages.map((image: string) => {
    return {
      url: `/data/${userId}/collections/${collectionId}/preview/${image}`,
      name: image,
    };
  });

  newConfig.preview = previewImagesFormatted;

  const directoryPath =
    baseDirectory + `/${userId}/collections/${collectionId}/generated`;

  const generatedImages = await readDirectory(directoryPath);

  const generatedImagesFormatted = generatedImages.map(
    (image) => `/data/${userId}/collections/${collectionId}/generated/${image}`
  );

  newConfig.generated = generatedImagesFormatted;

  await saveConfig({ userId, collectionId, config: newConfig });
  return newConfig;
}

export async function setConfig({
  userId,
  collectionId,
  newConfig,
}: {
  userId: string | string[] | undefined;
  collectionId: string | string[] | undefined;
  newConfig?: CollectionType;
}) {
  if (!userId || !collectionId) return null;

  await saveConfig({ userId, collectionId, config: newConfig });
  return newConfig;
}

export function compareByProperty<T, K extends keyof T>(
  a: T,
  b: T,
  property: K
): number {
  // compare the property value of the two elements
  if (a[property] > b[property]) {
    return 1;
  } else if (a[property] < b[property]) {
    return -1;
  } else {
    return 0;
  }
}

export function sortByProperty<T, K extends keyof T>(
  array: T[],
  property: K
): T[] {
  // copy the array to avoid mutating the original
  const copy = [...array];
  // sort the copy by the property using the compare function
  copy.sort((a, b) => compareByProperty(a, b, property));
  // return the sorted copy
  return copy;
}
