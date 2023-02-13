import axios from "axios";
import React, { useState } from "react";

const DragAndDrop = ({
  collectionId,
  layerId,
}: {
  collectionId: string;
  layerId: string;
}) => {
  const [files, setFiles] = useState<any>([]);

  const handleUploadImages = async (formData: any) => {
    const userId = localStorage.getItem("userId");
    const layerId = 1;
    const result = await axios
      .post(`/api/collections/${collectionId}/${layerId}/uploadImages`, files, {
        params: { userId: userId },
      })
      .then((res) => console.log(res));
  };

  return (
    <div className="max-w-xl">
      <label
        className="flex justify-center w-full h-48 px-4 transition backdrop-invert-[5%] hover:backdrop-invert-[.15]
       border-2 border-primary border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none"
      >
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="font-medium text-primary">
            Drop files to Attach, or
            <span className="text-blue-600 underline "> browse</span>
          </span>
        </span>
        <input
          multiple
          onChange={(e) => setFiles(e.target.files)}
          type="file"
          name="file_upload"
          className="hidden"
        />
      </label>
      <button
        onClick={handleUploadImages}
        className="btn w-full my-3 btn-primary btn-lg"
      >
        Upload
      </button>
    </div>
  );
};

export default DragAndDrop;
