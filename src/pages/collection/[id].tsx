import { useRouter } from "next/router";
import { useState } from "react";
import DragAndDrop from "@/components/DragAndDrop";

const CollectionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const traits = ["trait1", "trait2", "trait3"];
  const [selected, setSelected] = useState(0);
  const [newLayerName, setNewLayerName] = useState("");

  return !id ? (
    <div>No collection found</div>
  ) : (
    <div className="grid grid-cols-8">
      <div className="flex px-2 flex-col border-r-2 col-span-1 text-center h-screen">
        <h1 className="text-2xl font-semibold border-b-2 mb-12 py-2">Layers</h1>
        {traits.map((trait, index) => (
          <button
            key={index}
            className={`btn ${index == selected ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setSelected(index)}
          >
            <h1>{trait}</h1>
          </button>
        ))}
        <input
          placeholder="Layer name"
          className="input input-primary mt-6"
          onChange={(e) => setNewLayerName(e.target.value)}
          value={newLayerName}
        />
        <button className="btn btn-primary mt-2">Add new layer</button>
      </div>
      <div className="col-span-6">
        <h1 className="text-2xl font-semibold">Collection: {id}</h1>
        <h1 className="text-2xl font-semibold">Layer: {traits[selected]}</h1>
        <div></div>
        <DragAndDrop collectionId={`${id}`} layerId={`${selected}`} />
      </div>
    </div>
  );
};

export default CollectionPage;
