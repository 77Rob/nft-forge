import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const CreateNewLayer = () => {
  const dispatch = useAppDispatch();
  const [newLayerName, setNewLayerName] = useState("");

  const handleCreateLayer = async () => {
    dispatch();
  };
  return (
    <div>
      <input
        value={newLayerName}
        onChange={(e) => setNewLayerName(e.target.value)}
      />
      <button onClick={() => handleCreateLayer()}>Create Layer</button>
    </div>
  );
};
