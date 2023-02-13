/* eslint-disable @next/next/no-img-element */
import { Config } from "@/api-config";
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
interface Layer {
  name: string;
  images?: any[];
  order?: number;
  rarity?: number;
}

const CollectionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selected, setSelected] = useState(0);
  const [collection, setCollection] = useState<Config | null>();
  const [newLayerName, setNewLayerName] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadCollection = async () => {
      const collectionDetails = await axios.get("/api/collections/details", {
        params: {
          collectionId: id,
          userId: localStorage.getItem("userId"),
        },
      });
      setCollection(collectionDetails.data.config);
    };
    loadCollection();
  }, [refresh, id]);

  const handleUpdateOrder = async () => {
    if (collection) {
      const newOrder = [...collection.layers.map((layer) => layer.name)];
      const params = {
        collectionId: id,
        userId: localStorage.getItem("userId"),
        order: newOrder,
      };

      await axios.get("/api/collections/updateOrder", {
        params: params,
      });
      setRefresh((refresh) => !refresh);
    }
  };

  function handleLayerDown(index: number) {
    return async () => {
      if (collection) {
        const newLayers = collection.layers;
        const temp = newLayers[index];
        newLayers[index] = newLayers[index + 1];
        newLayers[index + 1] = temp;
        setCollection({ ...collection, layers: newLayers });
        await handleUpdateOrder();
      }
    };
  }

  function handleLayerUp(index: number) {
    return async () => {
      if (collection) {
        const newLayers = collection.layers;
        const temp = newLayers[index];
        newLayers[index] = newLayers[index - 1];
        newLayers[index - 1] = temp;
        setCollection({ ...collection, layers: newLayers });

        await handleUpdateOrder();
      }
    };
  }

  const handleDeleteLayer = async (layer: Layer) => {
    await axios.get("/api/collections/layers/delete", {
      params: {
        layerId: layer.name,
        collectionId: id,
        userId: localStorage.getItem("userId"),
      },
    });
    setRefresh((refresh) => !refresh);
  };

  const createNewLayer = async () => {
    await axios.get("/api/collections/layers/create", {
      params: {
        collectionId: id,
        layerName: newLayerName,
        userId: localStorage.getItem("userId"),
      },
    });
    setNewLayerName("");
    setRefresh((refresh) => !refresh);
  };

  return !collection ? (
    <div>No collection found</div>
  ) : (
    <div>
      <div className="grid gird-cols-6 grid-flow-col ">
        {collection?.preview?.map((layer, index) => {
          return (
            <div key={index} className="col-span-1">
              <img alt="preview" className="max-w-48" src={layer.url} />{" "}
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-5">
        <div className="flex flex-col bg-base-200 gap-2 shadow-2xl py-4  mx-2 px-4 rounded-lg my-4 col-span-1  h-screen">
          <h1 className="text-2xl text-center font-semibold  py-2">Traits</h1>
          {collection?.layers.map((layer, index) => (
            <div
              className="flex items-center gap-2 justify-between"
              key={index}
            >
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
                  index == selected ? "btn-primary" : "btn-outline"
                } btn btn-xs justify-start  flex flex-1`}
                onClick={() => setSelected(index)}
              >
                <h1 className="text-left">{layer.name}</h1>
              </button>
              <button
                disabled={(index == 0 && true) || false}
                onClick={handleLayerUp(index)}
                className={`btn btn-primary rounded-none rounded-t-lg btn-xs`}
              >
                <IconUp className="w-4" />
              </button>
              <button
                onClick={handleLayerDown(index)}
                disabled={
                  (index == collection.layers.length - 1 && true) || false
                }
                className={`btn btn-primary btn-xs rounded-b-lg rounded-none `}
              >
                <IconDown className="w-4" />
              </button>
            </div>
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

        <Layer
          collection={collection}
          selected={selected}
          setRefresh={setRefresh}
        />
        <div>
          <CollectionSettings
            config={collection}
            handleSubmit={async (values) => {
              await axios.get("/api/collections/set", {
                params: {
                  collectionId: id,
                  userId: localStorage.getItem("userId"),
                  config: JSON.stringify({ ...collection, ...values }),
                },
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
// Define the interface for the component props
