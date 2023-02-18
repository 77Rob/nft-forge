/* eslint-disable @next/next/no-img-element */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import { useEffect, useState } from "react";
import TrashIcon from "@/components/icons/IconTrash";
import { deleteGeneratedImage } from "@/store/collectionReducer";
import { setActiveStep } from "@/store/generatorReducer";

const Generated = () => {
  const dispatch = useAppDispatch();

  const collection = useAppSelector((state) => state.config.config);

  return (
    <div>
      <div className="flex items-center justify-between px-20">
        <h1 className="text-xl font-semibold my-5">Generated Images</h1>
        <h1 className="text-xl">Total: {collection.generated?.length}</h1>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(setActiveStep(2))}
        >
          Upload Images to IPFS
        </button>
      </div>
      <div className="grid grid-cols-8 gap-2">
        {collection.generated &&
          collection.generated.map((image, index) => {
            return (
              <div className="bg-base-200 rounded-xl" key={image}>
                <button
                  onClick={deleteGeneratedImage(image, dispatch)}
                  className="btn btn-xs btn-error mr-2 ml-auto"
                >
                  <TrashIcon className="w-4" />
                </button>
                <img
                  className="border border-primary rounded-xl"
                  alt={image}
                  src={image}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Generated;
