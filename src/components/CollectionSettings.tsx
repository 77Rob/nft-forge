import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveStep } from "@/store/generatorReducer";
import { generateImages } from "@/store/generativeCollectionReducer";

interface Values {
  name: string;
  description: string;
  amount: number;
  width: number;
  height: number;
  rarity: Array<number>;
}

// Define the validation schema for the form values
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
  amount: Yup.number().required("Required"),
  width: Yup.number().required("Required"),
  height: Yup.number().required("Required"),
  rarity: Yup.array().of(
    Yup.number()
      .min(0, "Must be between 0 and 1")
      .max(100, "Must be between 0 and 1")
      .required("Required")
  ),
});

const CollectionSettings = ({}: {}) => {
  const collection = useAppSelector(
    (state) => state.generativeCollection.config
  );
  const dispatch = useAppDispatch();
  const initialValues: Values = {
    name: collection.name || "",
    description: collection.description || "",
    amount: collection.amount || 0,
    width: collection.width || 500,
    height: collection.height || 500,
    rarity: collection.layers.map((layer) => layer.rarity) || [],
  };

  const handleSubmit = async (values: any) => {
    await axios.get("/api/collections/set", {
      params: {
        collectionId: collection.name,
        userId: localStorage.getItem("userId"),
        config: JSON.stringify({ ...collection, ...values }),
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, isSubmitting }) => (
        <Form
          onSubmit={handleSubmit}
          className="shadow-2xl py-4 bg-base-200 mx-2 px-4 rounded-lg my-4"
        >
          <h1 className="text-2xl text-center font-semibold  py-2">Settings</h1>
          <div className="mb-4">
            <label htmlFor="name" className="block  font-medium text-xs">
              Collection name
            </label>
            <Field
              id="name"
              name="name"
              type="text"
              className="input input-primary input-xs w-full mt-2"
            />
            <ErrorMessage name="name" className="text-red-600 text-sm mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block  font-medium text-xs">
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              type="text"
              className="textarea textarea-primary textarea-xs w-full mt-2"
            />
            <ErrorMessage
              name="description"
              className="text-red-600 text-sm mt-1"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block font-medium text-xs">
              Amount
            </label>
            <Field
              id="amount"
              name="amount"
              type="number"
              className="input input-primary input-xs w-full mt-2"
            />
            <ErrorMessage name="amount" className="text-red-600 text-sm mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="width" className="block  font-medium text-xs">
              Width (px)
            </label>
            <Field
              id="width"
              name="width"
              type="text"
              className="input input-primary input-xs w-full mt-2"
            />
            <ErrorMessage name="width" className="text-red-600 text-sm mt-1" />
          </div>
          <div className="mb-4">
            <label htmlFor="height" className="block  font-medium text-xs">
              Height (px)
            </label>
            <Field
              id="height"
              name="height"
              type="number"
              className="input input-primary input-xs w-full mt-2"
            />
            <ErrorMessage name="height" className="text-red-600 text-sm mt-1" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-xs text-center">Layers</h2>
            {collection.layers &&
              collection.layers.map((layer, index) => (
                <div key={index} className="flex items-center ">
                  <div className="flex w-full">
                    <h1 className="text-lg mt-1 text-center">{layer.name}</h1>
                  </div>
                  <div>
                    <label
                      htmlFor={`rarity[${index}]`}
                      className="font-medium text-xs"
                    >
                      Rarity
                    </label>
                    <Field
                      id={`rarity[${index}]`}
                      name={`rarity[${index}]`}
                      type="number"
                      className="input input-primary input-xs w-20"
                    />
                    <ErrorMessage
                      name={`rarity[${index}]`}
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                </div>
              ))}
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-full btn-primary my-5"
            >
              Save
            </button>
          </div>
          <div
            className="btn w-full btn-primary"
            onClick={() => generateImages(collection, dispatch)}
          >
            Generate
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CollectionSettings;
