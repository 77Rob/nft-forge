import { useState } from "react";
import UserCollections from "@/components/collections";
import axios from "axios";
import Router from "next/router";

const Collections = () => {
  const [newCollectionName, setNewCollectioName] = useState<string>("");

  const handleCreateCollection = async () => {
    const userId = localStorage.getItem("userId");
    const res = await axios
      .get("/api/collections/create", {
        params: {
          userId,
          collectionName: newCollectionName,
        },
      })
      .then((res) => {
        Router.push(`/collection/${newCollectionName}`);
      });
    setNewCollectioName("");
  };

  return (
    <div className="flex flex-col mx-auto max-w-6xl items-center space-y-6 mt-10 justify-center">
      <h1 className="text-5xl font-semibold">Create a new collection</h1>
      <h1 className="text-xl w-1/2">
        Creating a new collection is the first step in building your own unique
        NFTs. Each collection is made up of traits and images that will be used
        to generate NFTs. To get started, simply give your collection a name and
        click the {"'Create'"} button. Once your collection is created, you can
        add and manage layers and traits to make it truly your own. {"You'll"}{" "}
        be able to preview the generated art of your collection and see how it
        evolves as you add and modify its components. So let's get started and
        build something truly unique!
      </h1>
      <div className="flex mb-12 w-1/2 gap-4 flex-col">
        <input
          value={newCollectionName}
          className="input w-full h-16 text-xl text-center input-xl input-primary"
          placeholder="Collection name"
          onChange={(e) => setNewCollectioName(e.target.value)}
        />
        <button
          onClick={handleCreateCollection}
          className="btn text-xl h-16 w-full btn-primary"
        >
          Create
        </button>
      </div>
      <h1 className="text-5xl mb-12  font-semibold">Your collections</h1>
      <UserCollections />
    </div>
  );
};

export default Collections;
