import ThemeChange from "@/components/ThemeChange";

const Header = () => {
  return (
    <header className="flex justify-between items-center py-3 px-2">
      <h1 className="text-xl font-bold">NFT Forge</h1>
      <ThemeChange />
    </header>
  );
};

export default Header;
