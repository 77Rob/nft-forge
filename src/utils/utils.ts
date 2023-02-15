import { Config, baseDirectory, configFileName } from "@/api-config";
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
// define a function that takes a directory path as an argument and returns a promise
export async function packFiles(dir: string): Promise<Data | undefined> {
  // create an empty object to store the file names and paths
  let result: Data = {};
  // read the directory contents
  let files = await fs.promises.readdir(dir);
  // get the number of files
  let count = files.length;
  // check if the directory is empty
  if (count === 0) {
    // return the empty object
    return result;
  }
  // loop over the files array
  for (let i = 0; i < files.length; i++) {
    // get the file name
    let file = files[i];
    // get the full file path
    let filePath = path.join(dir, file);
    // check if the file is a directory
    let stats = await fs.promises.stat(filePath);
    // if the file is a directory, call the function recursively
    if (stats.isDirectory()) {
      let data = await packFiles(filePath);
      // merge the data object with the result object
      result = Object.assign(result, data);
      // decrement the count
      count--;
      // check if all files are processed
      if (count === 0) {
        // return the result object
        return result;
      }
    } else {
      // if the file is not a directory, add its name and path to the result object
      result[file] = filePath;
      // decrement the count
      count--;
      // check if all files are processed
      if (count === 0) {
        // return the result object
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

export const getConfig = ({
  userId,
  collectionId,
}: {
  userId: string | string[] | undefined;
  collectionId: string | string[] | undefined;
}) => {
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
    if (layerOrder[i]) {
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

  const preview = await generateImages({
    layers: newLayers.filter((l) => l.images.length > 0),
    directory: previewDirectoryPath,
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
  newConfig?: Config;
}) {
  if (!userId || !collectionId) return null;
  const config = getConfig({ userId, collectionId });
  if (!config) return null;

  saveConfig({ userId, collectionId, config: newConfig });
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
