import { useEffect, useState } from "react";
import Traits from "./Traits";
import { useRouter } from "next/router";
import { setConfig, loadCollection } from "@/store/collectionReducer";
import Generated from "@/pages/collection/[id]/Generated";
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
          Traits
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 1 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(1))}
        >
          Generated Art
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 2 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(2))}
        >
          IPFS
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 3 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(3))}
        >
          Metadata
        </li>
        <li
          className={`tab cursor-pointer w-40 ${
            activeStep == 4 && "tab-active"
          }`}
          onClick={() => dispatch(setActiveStep(4))}
        >
          Contract
        </li>
      </ul>
      {activeStep === 0 && <Traits />}
      {activeStep === 1 && <Generated />}
      {activeStep === 2 && <IPFS />}
      {activeStep === 3 && <Metadata />}
      {activeStep === 4 && <Contract />}
    </div>
  );
};

export default CollectionPage;
