import axios from "axios";
import React, { useState } from "react";

const FileInput = () => {
  const [files, setFiles] = useState<any>([]);

  const handleUploadImages = async (formData: any) => {
    // const formData = new FormData();
    // console.log(formData);
    // for (const key of Object.keys(files)) {
    //   formData.append("myFiles", files[key], files[key].name);
    // }
    const userId = localStorage.getItem("userId");
    console.log(userId);
    const layerId = 1;
    const result = await axios
      .post(`/api/${userId}/${layerId}/uploadImages`, files, {})
      .then((res) => console.log(res));
  };

  return (
    <div>
      <ul>
        {Object.keys(files).map((file: any) => (
          <li key={file.name}>{file.name}</li>
        ))}
      </ul>
      <input
        className="file-input file-input-lg file-input-primary"
        type="file"
        onChange={(e) => setFiles(e.target.files)}
      />
      <button onClick={handleUploadImages} className="btn btn-primary btn-lg">
        Upload
      </button>
    </div>
  );
};

export default FileInput;
