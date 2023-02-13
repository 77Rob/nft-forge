import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
/* eslint-disable @next/next/no-img-element */
import { Config, LayerType } from "@/api-config";
import axios from "axios";

interface Values {
  name: string;
  description: string;
  amount: number;
  width: number;
  height: number;
  layers: Array<LayerType>;
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

// Define the component function
const CollectionSettings = ({
  config,
  handleSubmit,
}: {
  config: Config;
  handleSubmit: (values: Values) => void;
}) => {
  // Define the initial values for the form
  console.log(config);
  const initialValues: Values = {
    name: config.name || "",
    description: config.description || "",
    amount: config.amount || 0,
    width: config.width || 500,
    height: config.height || 500,
    layers: config.layers || [],
  };

  // Define the onSubmit handler for the form
  const onSubmit = (values: Values) => {
    // Do something with the form values, such as sending them to an API
    console.log(values);
    handleSubmit(values);
  };

  // Return the JSX element for the component
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
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
            {config.layers &&
              config.layers.map((layer, index) => (
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
                      id={`layers[${index}].rarity`}
                      name={`layers[${index}].rarity`}
                      type="number"
                      className="input input-primary input-xs w-20"
                    />
                    <ErrorMessage
                      name={`layers[${index}].rarity`}
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
              className="btn w-full btn-primary"
            >
              Save
            </button>
          </div>
          <div
            className="btn w-full btn-primary"
            onClick={async () => {
              await axios.get("/api/collections/generate", {
                params: {
                  userId: localStorage.getItem("userId"),
                  collectionId: config.name,
                  config: JSON.stringify(config),
                },
              });
            }}
          >
            Generate
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CollectionSettings;
