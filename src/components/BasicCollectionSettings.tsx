import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveStep } from "@/store/generatorReducer";
import { generateImages } from "@/store/generativeCollectionReducer";

// Define the validation schema for the form values
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string(),
});

const CollectionSettings = ({}: {}) => {
  const collection = useAppSelector(
    (state) => state.generativeCollection.config
  );
  const dispatch = useAppDispatch();
  const initialValues = {
    name: collection.name || "",
    description: collection.description || "",
  };

  const handleSubmit = async (values: any) => {
    await axios.get("/api/basic_collections/set", {
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

          <div className="text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn w-full btn-primary my-5"
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CollectionSettings;
