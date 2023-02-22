/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layer } from "@/components/Layer";
import CollectionSettings from "@/components/CollectionSettings";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentCollection } from "@/store/generatorReducer";
import { LayerButton } from "../../../components/LayerButton";
import { handleCreateNewLayer } from "@/store/generativeCollectionReducer";
const Traits = () => {
  const router = useRouter();
  const { id } = router.query;
  const [newLayerName, setNewLayerName] = useState("");
  const [refresh, setRefresh] = useState(0);
  const dispatch = useAppDispatch();
  const collection = useAppSelector(
    (state) => state.generativeCollection.config
  );

  const createNewLayer = async () => {
    await axios.get("/api/collections/layers/create", {
      params: {
        collectionId: id,
        layerName: newLayerName,
        userId: localStorage.getItem("userId"),
      },
    });
    dispatch(
      handleCreateNewLayer({ name: newLayerName, rarity: 100, images: [] })
    );
    setNewLayerName("");
    window.location.reload();
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

        <Layer setRefresh={setRefresh} />
        <div>
          <CollectionSettings />
        </div>
      </div>
    </div>
  );
};

export default Traits;
