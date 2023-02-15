/* eslint-disable @next/next/no-img-element */
import DragAndDrop from "@/components/DragAndDrop";
import HeaderInput from "@/components/HeaderInput";
import ScrollableComponent from "@/components/ScrollableComponent";
import { Config } from "@/api-config";
import IconTrash from "../icons/IconTrash";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updatePreview } from "@/store";

export function Layer({ setRefresh }: { setRefresh: any }) {
  const config = useAppSelector((state) => state.config.config);
  const selected = useAppSelector((state) => state.generator.activeLayer);

  const dispatch = useAppDispatch();
  return !config ? (
    <div>Loading..</div>
  ) : (
    <>
      <div className="col-span-3 px-4 py-4">
        <div className="shadow-xl backdrop-blur-2xl rounded-xl bg-base-200 p-3 mb-4">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">Preview</h1>
            <button
              onClick={() => {
                dispatch(updatePreview());
              }}
              className="btn btn-primary"
            >
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-6">
            {config?.preview?.slice(0, 6).map((layer, index) => {
              const increment = config?.refetchId ? config.refetchId + 1 : 0;
              return (
                <div key={index + increment} className="col-span-1">
                  <img alt="preview" className="max-w-48" src={layer.url} />{" "}
                </div>
              );
            })}
          </div>
        </div>
        <div className="shadow-xl backdrop-blur-2xl rounded-xl bg-base-200 p-3">
          <h1 className="text-xl font-semibold">
            Trait: {config?.layers[selected]?.name}{" "}
          </h1>
          <h1 className="text-lg font-semibold">Images</h1>
          <ScrollableComponent height="150px" className="mb-4">
            <div className="grid grid-cols-6 gap-2 mb-12">
              {config?.layers[selected]?.images?.map((image, index) => (
                <div
                  key={index}
                  className="items-center flex flex-col text-center bg-base-200 rounded-xl "
                >
                  <button
                    onClick={async () => {
                      config?.layers[selected]?.images?.splice(index, 1);
                      await axios
                        .get("/api/collections/layers/deleteImage", {
                          params: {
                            layerName: config?.layers[selected]?.name,
                            collectionId: config?.name?.toString() || "",
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
                    className="object-contain  h-10 bg-base-300"
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
          <DragAndDrop
            onCompleted={() => setRefresh((refresh: any) => !refresh)}
            layerId={config?.layers[selected]?.name}
            collectionId={config?.name?.toString() || ""}
          />
          <div className="flex  justify-center"></div>
        </div>
      </div>
    </>
  );
}
