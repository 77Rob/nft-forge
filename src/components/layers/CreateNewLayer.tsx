import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const CreateNewLayer = () => {
  const dispatch = useAppDispatch();
  const [newLayerName, setNewLayerName] = useState("");

  return (
    <div>
      <input
        value={newLayerName}
        onChange={(e) => setNewLayerName(e.target.value)}
      />
      <button>Create Layer</button>
    </div>
  );
};
