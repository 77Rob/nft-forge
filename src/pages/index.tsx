import { useState } from "react";
import GenerativeUserCollections from "@/components/GenerativeUserCollections";
import axios from "axios";
import Router from "next/router";
import UserCollections from "@/components/UserCollections";

const Collections = () => {
  const [newGenerativeCollectionName, setNewGenerativeCollectioName] =
    useState<string>("");

  const handleCreateGenerativeCollection = async () => {
    const userId = localStorage.getItem("userId");
    const res = await axios
      .get("/api/collections/create", {
        params: {
          userId,
          collectionName: newGenerativeCollectionName,
        },
      })
      .then((res) => {
        Router.push(`/generativeCollection/${newGenerativeCollectionName}`);
      });
    setNewGenerativeCollectioName("");
  };
  const [newCollectionName, setNewCollectioName] = useState<string>("");

  const handleCreateCollection = async () => {
    const userId = localStorage.getItem("userId");
    const res = await axios
      .get("/api/basic_collections/create", {
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
      <h1 className="text-5xl font-semibold">
        Create a generative new collection
      </h1>
      <h1 className="text-xl w-1/2">
        Creating a new generative collection is the first step in building your
        own unique NFTs. Each collection is made up of traits and images that
        will be used to generate NFTs. To get started, simply give your
        collection a name and click the {"'Create'"} button. Once your
        collection is created, you can add and manage layers and traits to make
        it truly your own. {"You'll"} be able to preview the generated art of
        your collection and see how it evolves as you add and modify its
        components. So {"let's"} get started and build something truly unique!
      </h1>
      <div className="flex mb-12 w-1/2 gap-4 flex-col">
        <input
          value={newGenerativeCollectionName}
          className="input w-full h-16 text-xl text-center input-xl input-primary"
          placeholder="Generative collection name"
          onChange={(e) => setNewGenerativeCollectioName(e.target.value)}
        />
        <button
          onClick={handleCreateGenerativeCollection}
          className="btn text-xl h-16 w-full btn-primary"
        >
          Create
        </button>
      </div>
      <h1 className="text-5xl mb-12  font-semibold">
        Your generative collections
      </h1>
      <GenerativeUserCollections />
      <h1 className="text-5xl font-semibold">Create a new collection</h1>
      <h1 className="text-xl w-1/2">
        To get started, simply create a collection and upload desired images to
        IPFS. Once the images are uploaded you can configure and deploy NFT
        smart contracts.
      </h1>
      <div className="flex mb-12 w-1/2 gap-4 flex-col">
        <input
          value={newCollectionName}
          className="input w-full h-16 text-xl text-center input-xl input-primary"
          placeholder="Generative collection name"
          onChange={(e) => setNewCollectioName(e.target.value)}
        />
        <button
          onClick={handleCreateCollection}
          className="btn text-xl h-16 w-full btn-primary"
        >
          Create
        </button>
      </div>
      <h1 className="text-5xl mb-12  font-semibold">
        Your generative collections
      </h1>
      <UserCollections />
    </div>
  );
};

export default Collections;
