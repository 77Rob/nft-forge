import ThemeChange from "@/components/ThemeChange";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-3 px-2 border-b-[1px]">
      <h1 className="text-xl font-bold">NFT Forge</h1>
      <div>
        <Link href="/">
          <button className="btn btn-ghost py-0">Collections</button>
        </Link>
        <Link href="/docs">
          <button className="btn btn-ghost py-0">Docs</button>
        </Link>
      </div>
      <ThemeChange />
    </header>
  );
};

export default Header;
