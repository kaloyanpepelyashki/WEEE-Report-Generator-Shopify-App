import ActionButton from "../Atomic Components/ActionButton";

type NavBarProps = {
  action: () => void;
};

const Navbar: React.FC<NavBarProps> = ({ action }) => {
  return (
    <header className="mb-3">
      <nav className="w-full">
        <div className="w-full flex flex-row justify-end px-5">
          <ActionButton action={action} />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
