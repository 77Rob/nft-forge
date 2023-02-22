/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/router";
import { loadMetadata } from "@/store/generativeCollectionReducer";
import { useEffect } from "react";

const Metadata = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const collection = useAppSelector(
    (state) => state.generativeCollection.config
  );
  useEffect(() => {
    if (id) {
      loadMetadata({
        userId: `${localStorage.getItem("userId")}`,
        collectionId: `${id}`,
        dispatch,
      });
    }
  }, [id]);
  return (
    <div>
      <div className="grid grid-cols-6  gap-4">
        {collection.metadata &&
          collection.metadata.map((data: any) => {
            return (
              <div
                className="bg-base-200 p-4 text-sm rounded-xl"
                key={data.image}
              >
                <ul>
                  <li>Name: {data.name}</li>
                  <li className="overflow-auto">
                    Description: {data.description}
                  </li>
                  <li>
                    Image: <h1 className="overflow-auto">{data.image}</h1>
                  </li>
                  <li>
                    Attributes:
                    {data.attributes &&
                      data.attributes.map((att: any) => {
                        const key = Object.keys(att)[0];
                        const attribute = att[key];
                        return (
                          <li key={attribute}>
                            {key} : {attribute}
                          </li>
                        );
                      })}
                  </li>
                </ul>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Metadata;
