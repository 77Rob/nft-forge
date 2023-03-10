export interface Image {
  url: string;
  name: string;
}

export interface LayerType {
  name: string;
  rarity: number;
  images: Image[];
}

export interface GenerativeCollectionType {
  layers: LayerType[];
  ipfsHash?: string;
  ipfsUrlImages?: string;
  ipfsUrlMetadata?: string;
  name: string;
  description?: string;
  image?: string;
  amount?: number;
  width?: number;
  preview?: any[];
  metadata?: any;
  height: number;
  images?: any[];
  generated?: any[];
  refetchId?: number;
}

export interface CollectionType {
  ipfsHash?: string;
  ipfsUrlImages?: string;
  ipfsUrlMetadata?: string;
  name: string;
  description?: string;
  width?: number;
  preview?: any[];
  metadata?: any;
  images?: any[];
}

export function isCollection(obj: any): obj is CollectionType {
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
