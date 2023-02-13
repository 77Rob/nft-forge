import axios from "axios";
import CollectionCard from "./collection/CollectionCard";
import { useEffect, useState } from "react";

const UserCollections = () => {
  const [collections, setCollections] = useState<string[]>();

  useEffect(() => {
    const loadCollections = async () => {
      const userId = localStorage.getItem("userId");
      const collections = await axios.get(`/api/collections/`, {
        params: {
          userId,
        },
      });
      setCollections(collections.data);
      console.log(collections);
    };
    loadCollections();
  }, []);

  return !collections ? (
    <div>
      <h1 className="text-3xl">You do not have any collections</h1>
    </div>
  ) : (
    <div className="grid grid-cols-3 gap-4">
      {collections.map((collection) => (
        <CollectionCard key={collection} name={collection} />
      ))}
    </div>
  );
};

export default UserCollections;
