import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initUser,
  updatePinataApiKey,
  updateWeb3StorageKey,
} from "@/store/userReducer";
import {
  uploadImagesToIPFSPinata,
  uploadImagesToIPFSWeb3Storage,
  uploadMetadataToIPFSPinata,
  uploadMetadataToIPFSWeb3Storage,
} from "@/store/generativeCollectionReducer";

import { useEffect, useState } from "react";

const IPFS = () => {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [newPinataKey, setNewPinataKey] = useState<string>("");
  const [newWeb3StorageKey, setNewWeb3StorageKey] = useState<string>("");
  const collection = useAppSelector(
    (state) => state.generativeCollection.config
  );

  useEffect(() => {
    initUser(localStorage.getItem("userId"), dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(collection.ipfsUrlImages);
  return (
    <div className="">
      <div className="space-y-2 mx-auto bg-base-200 max-w-xl p-2 rounded-xl">
        <h1 className="text-xl font-semibold text-center">IPFS</h1>
        {/* Pinata */}
        {/* <div className="space-x-4 flex items-center">
          <label className="label">Pinata API Key: </label>
          <h1>{user.pinataKey ? user.pinataKey : "Key not specified"}</h1>
        </div>

        <div className=" flex items-center space-x-4">
          <label className="label">New Pinata API Key: </label>
          <input
            value={newPinataKey}
            className="input flex-1 input-primary input-sm"
            onChange={(e) => setNewPinataKey(e.target.value)}
          />
          <button
            onClick={() =>
              updatePinataApiKey(
                `${localStorage.getItem("userId")}`,
                newPinataKey,
                dispatch
              )
            }
            className="btn btn-primary btn-sm"
          >
            Update
          </button>
        </div>
        <div className="flex flex-col gap-4 items-stretch  justify-center">
          <button
            onClick={() =>
              uploadImagesToIPFSPinata({
                collectionId: collection.name,
                userId: `${localStorage.getItem("userId")}`,
                dispatch: dispatch,
              })
            }
            className="btn btn-primary btn-sm mx-auto"
          >
            Upload Images Using Pinata
          </button>
          <button
            disabled={collection.ipfsUrlImages ? false : true}
            onClick={() =>
              uploadMetadataToIPFSPinata({
                collectionId: collection.name,
                userId: `${localStorage.getItem("userId")}`,
                dispatch: dispatch,
              })
            }
            className="btn btn-primary btn-sm mx-auto"
          >
            Upload Metadata Using Pinata
          </button>
        </div> */}

        {/* Web3 Storage */}
        <div className="space-x-4 flex items-center">
          <label className="label min-w-[180px]">Web3 Storage API Key: </label>
          <h1 className="overflow-auto">
            {user.web3StorageKey ? user.web3StorageKey : "Key not specified"}
          </h1>
        </div>

        <div className=" flex items-center space-x-4">
          <label className="label">New Web3 Storage API Key: </label>
          <input
            value={newWeb3StorageKey}
            className="input flex-1 input-primary input-sm"
            onChange={(e) => setNewWeb3StorageKey(e.target.value)}
          />
          <button
            onClick={() =>
              updateWeb3StorageKey(
                `${localStorage.getItem("userId")}`,
                newWeb3StorageKey,
                dispatch
              )
            }
            className="btn btn-primary btn-sm"
          >
            Update
          </button>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <button
            onClick={async () =>
              await uploadImagesToIPFSWeb3Storage({
                collectionId: collection.name,
                userId: `${localStorage.getItem("userId")}`,
                dispatch: dispatch,
              })
            }
            className="btn btn-primary btn-sm mx-auto"
          >
            Upload Images Using Web3Storage
          </button>
          <button
            disabled={collection.ipfsUrlImages ? false : true}
            onClick={async () =>
              await uploadMetadataToIPFSWeb3Storage({
                collectionId: collection.name,
                userId: `${localStorage.getItem("userId")}`,
                dispatch: dispatch,
              })
            }
            className="btn btn-primary btn-sm mx-auto"
          >
            Upload Metadata Using Web3Storage
          </button>
        </div>

        <div className="space-x-4 flex items-center">
          <label className="label">Images IPFS url: </label>
          <h1>
            {collection.ipfsUrlImages
              ? collection.ipfsUrlImages.toString()
              : "Images have not been uploaded yet"}
          </h1>
        </div>
        <div className="space-x-4 flex items-center">
          <label className="label">Metadata IPFS url: </label>
          <h1>
            {collection.ipfsUrlMetadata
              ? collection.ipfsUrlMetadata.toString()
              : "Metadata have not been uploaded yet"}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default IPFS;
