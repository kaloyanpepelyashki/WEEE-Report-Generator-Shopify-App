import CloseButton from "../Atomic Components/CloseButton";

type InstructinsPopUpProps = {
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

const InstructinsPopUp: React.FC<InstructinsPopUpProps> = ({
  setOpenState,
}) => {
  return (
    <div className="w-full h-full absolute flex flex-col justify-center items-center z-50">
      <div className="instructions-pop-up-blur-background w-full h-full absolute bg-slate-300 opacity-45 blur-xl"></div>
      <div className="confirmation-pop-up-window flex flex-col z-50 bg-primary px-7 py-7 rounded-xl ">
        <div className="confirmation-pop-up-window-top-section flex flex-row justify-end items-end self-end">
          <CloseButton action={() => setOpenState(false)} />
        </div>
      </div>
    </div>
  );
};

export default InstructinsPopUp;
