import Link from "next/link";

export interface CollectionCardProps {
  name: string;
}

const GenerativeCollectionCard = ({ name }: CollectionCardProps) => {
  return (
    <Link
      className="text-center col-span-1"
      href={`/generativeCollection/${name}`}
    >
      <div className="flex w-full h-32 text-center items-center justify-center transform hover:translate-y-[-10px] px-8 border-primary border-2 rounded-xl bg-base-200 hover:bg-base-300">
        <h1 className="text-2xl font-bold text-center hover:font-bold">
          {name}
        </h1>
      </div>
    </Link>
  );
};

export default GenerativeCollectionCard;
