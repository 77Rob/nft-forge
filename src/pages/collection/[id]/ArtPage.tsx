/* eslint-disable @next/next/no-img-element */
import IconDown from "@/components/icons/IconDown";
import TrashIcon from "@/components/icons/IconTrash";
import IconUp from "@/components/icons/IconUp";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layer } from "@/components/collection/Layer";
import CollectionSettings from "@/components/collection/CollectionSettings";
import Link from "next/link";
import ConfirmationButton from "@/components/ConfirmationButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentCollection, setActiveLayer } from "@/store/generator";
import { setConfig, handleLayerDown, handleLayerUp } from "@/store";
import { LayerType, Config } from "@/store/config";
interface Layer {
  name: string;
  images?: any[];
  order?: number;
  rarity?: number;
}

const ArtPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [newLayerName, setNewLayerName] = useState("");
  const [refresh, setRefresh] = useState(0);
  const dispatch = useAppDispatch();
  const activeLayer = useAppSelector((state) => state.generator.activeLayer);
  const collection = useAppSelector((state) => state.config.config);

  const createNewLayer = async () => {
    await axios.get("/api/collections/layers/create", {
      params: {
        collectionId: id,
        layerName: newLayerName,
        userId: localStorage.getItem("userId"),
      },
    });
    setNewLayerName("");
    setRefresh((refresh) => refresh + 1);
  };

  return !collection ? (
    <div>No collection found</div>
  ) : (
    <div>
      <div className="grid gird-cols-6 grid-flow-col "></div>
      <div className="grid grid-cols-5">
        <div className="flex flex-col bg-base-200 gap-2 shadow-2xl py-4  mx-2 px-4 rounded-lg my-4 col-span-1  h-screen">
          <h1 className="text-2xl text-center font-semibold  py-2">Traits</h1>
          {collection?.layers.map((layer, index: number) => (
            <LayerButton key={index} index={index} />
          ))}
          <h1>
            You can rearrange your traits by moving them up or down. The image
            will reflect the order of the list, with the top trait at the front
            and the bottom trait at the back.
          </h1>
          <input
            placeholder="Layer name"
            className="input input-primary input-sm mt-6"
            onChange={(e) => setNewLayerName(e.target.value)}
            value={newLayerName}
          />
          <button
            className="btn btn-primary btn-sm mt-2"
            onClick={() => createNewLayer()}
          >
            Add new layer
          </button>
        </div>

        <Layer key={1} setRefresh={setRefresh} />
        <div>
          <CollectionSettings />
        </div>
      </div>
    </div>
  );
};

export default ArtPage;

function LayerButton({ index }: { index: number }): JSX.Element {
  const dispatch = useAppDispatch();
  const activeLayer = useAppSelector((state) => state.generator.activeLayer);
  const currentCollection = useAppSelector(
    (state) => state.generator.currentCollection
  );
  const collection = useAppSelector((state) => state.config.config);
  const layer = collection.layers[index];
  console.log(layer, index);

  const handleDeleteLayer = async (layer: Layer) => {
    await axios.get("/api/collections/layers/delete", {
      params: {
        layerId: layer.name,
        collectionId: currentCollection,
        userId: localStorage.getItem("userId"),
      },
    });
  };

  return (
    <div className="flex items-center gap-2 justify-between" key={index}>
      <ConfirmationButton
        confirmationText="Do you want to delete this trait? This action cannot be undone. All images associated with this trait will be deleted."
        title="Delete trait"
        onConfirmed={() => handleDeleteLayer(layer)}
        className="btn h-full btn-error btn-xs"
      >
        <TrashIcon className="w-3" />
      </ConfirmationButton>
      <button
        className={`${
          index == activeLayer ? "btn-primary" : "btn-outline"
        } btn btn-xs justify-start  flex flex-1`}
        onClick={() => dispatch(setActiveLayer(index))}
      >
        <h1 className="text-left">{layer.name}</h1>
      </button>
      <button
        disabled={(index == 0 && true) || false}
        onClick={() => dispatch(handleLayerUp(index))}
        className={`btn btn-primary rounded-none rounded-t-lg btn-xs`}
      >
        <IconUp className="w-4" />
      </button>
      <button
        onClick={() => dispatch(handleLayerDown(index))}
        disabled={(index == collection.layers.length - 1 && true) || false}
        className={`btn btn-primary btn-xs rounded-b-lg rounded-none `}
      >
        <IconDown className="w-4" />
      </button>
    </div>
  );
}
// Define the interface for the component props
