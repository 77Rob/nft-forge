export const baseDirectory = `./public/data`;
export const configFileName = "config.json";

export interface Image {
  url: string;
  name: string;
  path: string;
}

export interface LayerType {
  name: string;
  rarity: number;
  id: number;
  images: Image[];
}
export interface Config {
  layers: LayerType[];
  ipfsHash?: string;
  ipfsUrl?: string;
  name?: string;
  description?: string;
  image?: string;
  amount?: number;
  width?: number;
  preview?: any[];
  height: number;
}

export function isConfig(obj: any): obj is Config {
  return (
    obj &&
    Array.isArray(obj.layers) &&
    (obj.ipfsHash === undefined || typeof obj.ipfsHash === "string") &&
    (obj.ipfsUrl === undefined || typeof obj.ipfsUrl === "string") &&
    (obj.name === undefined || typeof obj.name === "string") &&
    (obj.description === undefined || typeof obj.description === "string") &&
    (obj.image === undefined || typeof obj.image === "string") &&
    (obj.amount === undefined || typeof obj.amount === "number") &&
    (obj.width === undefined || typeof obj.width === "number") &&
    typeof obj.height === "number"
  );
}
export function isLayerType(obj: any): obj is LayerType {
  return (
    obj &&
    typeof obj.name === "string" &&
    typeof obj.rarity === "number" &&
    typeof obj.id === "number" &&
    Array.isArray(obj.images) &&
    obj.images.every(isImage)
  );
}
export function isImage(obj: any): obj is Image {
  return obj && typeof obj.name === "string" && typeof obj.url === "string";
}
