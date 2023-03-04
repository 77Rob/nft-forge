/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import DragAndDropBasic from "@/components/DragAndDropBasic";
import ScrollableComponent from "@/components/ScrollableComponent";
import IconTrash from "@/components/icons/IconTrash";
import { loadCollection } from "@/store/basicCollectionReducer";
import BasicCollectionSettings from "@/components/BasicCollectionSettings";

const Traits = () => {
  const router = useRouter();
  const { id } = router.query;
  const [newLayerName, setNewLayerName] = useState("");
  const [refresh, setRefresh] = useState(0);
  const dispatch = useAppDispatch();
  const collection = useAppSelector((state) => state.basicCollection.config);

  return !collection ? (
    <div>No collection found</div>
  ) : (
    <div className="grid grid-cols-7">
      <div className="col-span-6">
        <ScrollableComponent height="450px" className="mb-4">
          <div className="grid gap-4 grid-cols-8">
            {collection.images &&
              collection.images.map((image) => (
                <div
                  key={image.name}
                  className="items-center flex flex-col text-center bg-base-200 rounded-xl "
                >
                  <button
                    onClick={async () => {
                      await axios
                        .get("/api/basic_collections/deleteImage", {
                          params: {
                            imagePath: image,
                          },
                        })
                        .then(() => {
                          loadCollection(id as string, dispatch);
                        });
                    }}
                    className="btn mr-1 ml-auto my-1 btn-error rounded-lg btn-xs"
                  >
                    <IconTrash className="w-4" />
                  </button>
                  <img
                    className="object-contain h-20 bg-base-300"
                    src={image}
                    alt=""
                  />
                </div>
              ))}{" "}
          </div>
        </ScrollableComponent>
        <DragAndDropBasic
          collectionId={`${id}`}
          onCompleted={() => loadCollection(`${id}`, dispatch)}
        />
      </div>

      <BasicCollectionSettings />
    </div>
  );
};

export default Traits;
