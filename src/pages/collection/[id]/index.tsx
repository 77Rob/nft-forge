import { useEffect, useState } from "react";
import Images from "./Images";
import { useRouter } from "next/router";
import { setConfig, loadCollection } from "@/store/basicCollectionReducer";
import { setActiveStep, setCurrentCollection } from "@/store/generatorReducer";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import axios from "axios";
import IPFS from "@/pages/collection/[id]/IPFS";
import Contract from "@/pages/collection/[id]/Contract";
import Metadata from "./Metadata";

const CollectionPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector((state) => state.generator.activeStep);

  useEffect(() => {
    if (id) {
      dispatch(setCurrentCollection(id as string));
      loadCollection(id as string, dispatch);
    }
  }, [id]);

  return !id ? (
    <div></div>
  ) : (
    <div>
      <ul className=" flex justify-center tabs mx-auto mb-2 pt-2 tabs-boxed">
        <li
          onClick={() => dispatch(setActiveStep(0))}
          className={`tab cursor-pointer w-40 step-primary ${
            activeStep == 0 && "tab-active"
          }`}
        >
          Images
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 1 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(1))}
        >
          IPFS
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 2 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(2))}
        >
          Metadata
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 3 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(3))}
        >
          Contract
        </li>
      </ul>
      {activeStep === 0 && <Images />}
      {activeStep === 1 && <IPFS />}
      {activeStep === 2 && <Metadata />}
      {activeStep === 3 && <Contract />}
    </div>
  );
};

export default CollectionPage;
