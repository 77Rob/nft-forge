import * as fs from "fs";
import * as path from "path";

export const createDirectory = (directoryPath: string) => {
  const directories = directoryPath.split("/");
  let currentPath = "";

  for (const directory of directories) {
    currentPath += directory + "/";

    if (!fs.existsSync(currentPath)) {
      fs.mkdirSync(currentPath);
    }
  }
  console.log("Done");
};
export const readDirectory = (directoryPath: string) => {
  fs.readdir(directoryPath, (error, files) => {
    if (error) {
      console.error(`An error occurred while reading the directory: ${error}`);
      return;
    }

    console.log(`Files in directory "${directoryPath}":`);
    return files;
  });
};

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

      console.log(`Directory "${directoryPath}" was deleted successfully.`);
    });
  });
};
