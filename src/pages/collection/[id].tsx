import { useRouter } from "next/router";
import { useState } from "react";
import DragAndDrop from "@/components/DragAndDrop";
import { useEffect } from "react";
import axios from "axios";
import Image from "next/image";

interface Layer {
  name: string;
  images?: any[];
  rarity?: number;
}

const CollectionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selected, setSelected] = useState(0);
  const [collection, setCollection] = useState({ layers: [] });
  const [newLayerName, setNewLayerName] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const loadCollection = async () => {
      console.log(router);
      console.log(id);
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

  const createNewLayer = async () => {
    const res = await axios.get("/api/collections/layers/create", {
      params: {
        collectionId: id,
        layerName: newLayerName,
        userId: localStorage.getItem("userId"),
      },
    });
    setRefresh((refresh) => !refresh);
  };

  return !id ? (
    <div>No collection found</div>
  ) : (
    <div className="grid grid-cols-8">
      <div className="flex px-2 flex-col border-r-2 col-span-1 min-w- text-center h-screen">
        <h1 className="text-2xl font-semibold border-b-2 mb-12 py-2">Layers</h1>
        {collection?.layers.map((layer, index) => (
          <button
            key={index}
            className={`btn ${index == selected ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setSelected(index)}
          >
            <h1>{layer.name}</h1>
          </button>
        ))}
        <input
          placeholder="Layer name"
          className="input input-primary mt-6"
          onChange={(e) => setNewLayerName(e.target.value)}
          value={newLayerName}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={() => createNewLayer()}
        >
          Add new layer
        </button>
        <button onClick={() => console.log(collection)}>Log</button>
      </div>
      <div className="col-span-6">
        <h1 className="text-2xl font-semibold">Collection: {id}</h1>
        <h1 className="text-2xl font-semibold">
          Layer: {collection?.layers[selected]?.name}
        </h1>
        <div>
          {collection?.layers[selected]?.images?.map((image, index) => {
            console.log(image);
            return (
              <Image
                className="object-contain"
                width={100}
                height={100}
                key={index}
                src={image.url}
                alt={""}
              />
            );
          })}
        </div>
        <DragAndDrop collectionId={`${id}`} layerId={`${selected}`} />
      </div>
    </div>
  );
};

export default CollectionPage;
