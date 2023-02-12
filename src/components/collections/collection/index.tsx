import CollectionCard, { CollectionCardType } from "./CollectionCard";

const Collections = (collections: CollectionCardType[]) => {
  return (
    <div>
      {collections.map((collection) => (
        <CollectionCard key={collection.name} name={collection.name} />
      ))}
    </div>
  );
};

export default Collections;

export async function getServerSideProps() {
  const userId = localStorage.getItem("userId");
  const collections = await fetch(
    `http://localhost:3000/api/collections/${userId}`
  );

  return {
    props: { collections },
  };
}
