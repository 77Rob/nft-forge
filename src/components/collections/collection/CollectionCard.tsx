export interface CollectionCardType {
  name: string;
}

const CollectionCard = ({ name }: CollectionCardType) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default CollectionCard;
