import { useState } from "react";
import FileInput from "../components/FileInput";
import { UiFileInputButton } from "@/components/Uploader";

export default function Home() {
  const handleCreateLayer = async () => {
    await fetch("/api/layers/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        layerName: newLayerName,
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  const [newLayerName, setNewLayerName] = useState("");
  return (
    <>
      <input
        value={newLayerName}
        onChange={(e) => setNewLayerName(e.target.value)}
      />
      <UiFileInputButton />
      <button onClick={() => handleCreateLayer()}>Create Layer</button>
      <FileInput />
    </>
  );
}
