import Link from "next/link";

export interface CollectionCardProps {
  name: string;
}

const CollectionCard = ({ name }: CollectionCardProps) => {
  return (
    <Link href={`/collection/${name}`}>
      <div className="py-12 transform hover:translate-y-[-10px] px-8 border-primary border-2 rounded-xl bg-base-200 hover:bg-base-300">
        <h1 className="text-2xl font-bold text-center">{name}</h1>
      </div>
    </Link>
  );
};

export default CollectionCard;
