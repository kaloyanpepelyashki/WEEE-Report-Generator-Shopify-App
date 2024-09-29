import ActionButton from "../Atomic Components/ActionButton";
import { ButtonGroup } from "@shopify/polaris";
import CancelButton from "../Atomic Components/CancelButton";
import CloseButton from "../Atomic Components/CloseButton";

type ConfirmationPopUpProps = {
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  finishAction: () => void;
};

const ConfirmationPopUp: React.FC<ConfirmationPopUpProps> = ({
  setOpenState,
  finishAction,
}) => {
  return (
    <div className="w-full h-full absolute flex flex-col justify-center items-center z-50">
      <div className="confirmation-pop-up-blur-background w-full h-full absolute bg-slate-300 opacity-45 blur-xl"></div>
      <div className="confirmation-pop-up-window flex flex-col z-50 bg-primary px-7 py-7 rounded-xl">
        <div className="confirmation-pop-up-window-top-section flex flex-row justify-end items-end self-end">
          <CloseButton action={() => setOpenState(false)} />
        </div>
        <h2 className="text-xl font-bold mb-2">
          Are you sure you want to finish set up?
        </h2>
        <p>Have you selected all categories of products you sell?</p>
        <p>
          If you choose to proceed now, you will have to create all missing
          categories manually.
        </p>
        <div className="confirmation-pop-up-window-buttons-holder w-full flex flex-row items-center justify-end mt-7">
          <ButtonGroup>
            <CancelButton action={() => setOpenState(false)} />
            <ActionButton heading="Finish" action={finishAction} />
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopUp;
