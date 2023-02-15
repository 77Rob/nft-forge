import { useEffect, useState } from "react";
import ArtPage from "./ArtPage";
import { useRouter } from "next/router";
import { setConfig } from "@/store/index";
import { setCurrentCollection } from "@/store/generator";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";

const CollectionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const [refresh, setRefresh] = useState(0);
  const activeLayer = useAppSelector((state) => state.generator.activeLayer);
  const collection = useAppSelector((state) => state.config.config);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const loadCollection = async () => {
      const collectionDetails = await axios.get("/api/collections/details", {
        params: {
          collectionId: id,
          userId: localStorage.getItem("userId"),
        },
      });
      console.log(collectionDetails);

      dispatch(setConfig(collectionDetails.data.config));
    };
    if (id) {
      dispatch(setCurrentCollection(id as string));
      loadCollection();
    }
  }, [id]);

  return !id ? (
    <div></div>
  ) : (
    <div>
      <ul className=" flex justify-center steps mx-auto steps-horizontal">
        <li
          onClick={() => setActiveStep(0)}
          className={`step cursor-pointer step-primary`}
        >
          Generate Art
        </li>
        <li
          className={`step cursor-pointer ${activeStep > 0 && "step-primary"}`}
          onClick={() => setActiveStep(1)}
        >
          Metadata
        </li>
        <li
          className={`step cursor-pointer ${activeStep > 1 && "step-primary"}`}
          onClick={() => setActiveStep(2)}
        >
          Smart Contract
        </li>
        <li
          className={`step cursor-pointer ${activeStep > 2 && "step-primary"}`}
          onClick={() => setActiveStep(3)}
        >
          Deploy
        </li>
      </ul>
      {activeStep === 0 && <ArtPage />}
    </div>
  );
};

export default CollectionPage;
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
