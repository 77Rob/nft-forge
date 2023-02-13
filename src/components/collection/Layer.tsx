/* eslint-disable @next/next/no-img-element */
import DragAndDrop from "@/components/DragAndDrop";
import HeaderInput from "@/components/HeaderInput";
import ScrollableComponent from "@/components/ScrollableComponent";
import { Config } from "@/api-config";
import IconTrash from "../icons/IconTrash";
import axios from "axios";

export function Layer({
  collection,
  selected,
  setRefresh,
}: {
  collection: Config;
  selected: number;
  setRefresh: any;
}) {
  return (
    <>
      <div className="col-span-3 px-4 py-4">
        <ScrollableComponent height="500px">
          <div className="grid grid-cols-5 gap-2 mb-12">
            {collection?.layers[selected]?.images?.map((image, index) => (
              <div
                key={index}
                className="items-center flex flex-col text-center bg-base-200 rounded-xl "
              >
                <button
                  onClick={async () => {
                    collection?.layers[selected]?.images?.splice(index, 1);
                    await axios
                      .get("/api/collections/layers/deleteImage", {
                        params: {
                          layerName: collection?.layers[selected]?.name,
                          collectionId: collection?.name?.toString() || "",
                          userId: localStorage.getItem("userId"),
                          imageName: image.name,
                        },
                      })
                      .then(() => {
                        window.location.reload();
                      });
                  }}
                  className="btn mr-1 ml-auto my-1 btn-error rounded-lg btn-xs"
                >
                  <IconTrash className="w-4" />
                </button>
                <img
                  className="object-contain px-2 h-40 bg-base-300"
                  src={image.url}
                  alt=""
                />
                <HeaderInput
                  value={image.name}
                  setValue={(newValue) => console.log(newValue)}
                />
              </div>
            ))}
          </div>
        </ScrollableComponent>
        <div className="flex  justify-center">
          <DragAndDrop
            onCompleted={() => setRefresh((refresh: any) => !refresh)}
            layerId={collection?.layers[selected]?.name}
            collectionId={collection?.name?.toString() || ""}
          />
        </div>
      </div>
    </>
  );
}
