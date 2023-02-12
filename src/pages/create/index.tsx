import { useState } from "react";

const CreatePage = () => {
  const [newCollectionName, setNewCollectioName] = useState<string>("");

  return (
    <div>
      <div>
        <h1>Create a new collection</h1>
        <input
          value={newCollectionName}
          onChange={(e) => setNewCollectioName(e.target.value)}
        />
        <button>Create</button>
      </div>
      <div>
        <h1>Your collections</h1>
      </div>
    </div>
  );
};

export default CreatePage;
