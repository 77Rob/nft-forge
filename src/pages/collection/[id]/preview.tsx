/* eslint-disable @next/next/no-img-element */
import { Config } from "@/api-config";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const CollectionPreview = () => {
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

  return !router.isReady ? (
    <div> Loading....</div>
  ) : (
    <div>
      <div></div>
    </div>
  );
};

export default CollectionPreview;
