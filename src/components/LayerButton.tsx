import IconDown from "@/components/icons/IconDown";
import TrashIcon from "@/components/icons/IconTrash";
import IconUp from "@/components/icons/IconUp";
import axios from "axios";
import { LayerType } from "@/types/config.dto";
import ConfirmationButton from "@/components/ConfirmationButton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveLayer } from "@/store/generatorReducer";
import { handleLayerDown, handleLayerUp } from "@/store/collectionReducer";

export function LayerButton({ index }: { index: number }): JSX.Element {
  const dispatch = useAppDispatch();
  const activeLayer = useAppSelector((state) => state.generator.activeLayer);
  const currentCollection = useAppSelector(
    (state) => state.generator.currentCollection
  );
  const collection = useAppSelector((state) => state.config.config);
  const layer = collection.layers[index];
  console.log(layer, index);

  const handleDeleteLayer = async (layer: LayerType) => {
    await axios.get("/api/collections/layers/delete", {
      params: {
        layerId: layer.name,
        collectionId: currentCollection,
        userId: localStorage.getItem("userId"),
      },
    });
  };

  return (
    <div className="flex items-center gap-2 justify-between" key={index}>
      <ConfirmationButton
        confirmationText="Do you want to delete this trait? This action cannot be undone. All images associated with this trait will be deleted."
        title="Delete trait"
        onConfirmed={() => handleDeleteLayer(layer)}
        className="btn h-full btn-error btn-xs"
      >
        <TrashIcon className="w-3" />
      </ConfirmationButton>
      <button
        className={`${
          index == activeLayer ? "btn-primary" : "btn-outline"
        } btn btn-xs justify-start  flex flex-1`}
        onClick={() => dispatch(setActiveLayer(index))}
      >
        <h1 className="text-left">{layer.name}</h1>
      </button>
      <button
        disabled={(index == 0 && true) || false}
        onClick={() => dispatch(handleLayerUp(index))}
        className={`btn btn-primary rounded-none rounded-t-lg btn-xs`}
      >
        <IconUp className="w-4" />
      </button>
      <button
        onClick={() => dispatch(handleLayerDown(index))}
        disabled={(index == collection.layers.length - 1 && true) || false}
        className={`btn btn-primary btn-xs rounded-b-lg rounded-none `}
      >
        <IconDown className="w-4" />
      </button>
    </div>
  );
}
