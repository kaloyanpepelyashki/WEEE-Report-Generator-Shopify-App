import { ButtonGroup, Divider, InlineError } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import DatePickerComponent from "../Atomic Components/DatePickerComponent";
import ActionButton from "../Atomic Components/ActionButton";
import ExportStateType from "~/Models/ExportStateType";
import CountryListSelector from "./CountryListSelector";
import { useCallback } from "react";
import CancelButton from "../Atomic Components/CancelButton";
import CloseButton from "../Atomic Components/CloseButton";
import { FetcherWithComponents } from "@remix-run/react";

type ExportPopUpType = {
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  primaryAction: () => void;
  setExportState: React.Dispatch<React.SetStateAction<ExportStateType>>;
  exportState: ExportStateType;
  fetcher: FetcherWithComponents<unknown>;
  error: boolean;
  errorText: string;
};

const ExportPopUp: React.FC<ExportPopUpType> = ({
  setOpenState,
  primaryAction,
  setExportState,
  exportState,
  fetcher,
  error,
  errorText,
}) => {
  return (
    <div className="w-full h-full absolute flex flex-col justify-center items-center z-50">
      <div className="confirmation-pop-up-blur-background w-full h-full absolute bg-slate-300 opacity-45 blur-xl"></div>
      <div className="export-pop-up-wrapper w-7/12 flex flex-col px-5 py-3 pt-6 z-50 bg-primary rounded-xl">
        <div className="export-pop-up-top-section w-full flex flex-row justify-between pb-3.5">
          <h2 className="text-3xl font-bold">Export</h2>
          <CloseButton action={() => setOpenState(false)} />
        </div>
        <Divider borderWidth="050" borderColor="border-inverse" />
        <section className="export-pop-up-main-section w-full flex flex-col pt-8">
          <div className="export-pop-up-date-pickers-holder w-full flex flex-row justify-between">
            <div className="w-1/2">
              <DatePickerComponent
                purpose="From"
                setDate={setExportState}
                label="From"
                selectedDate={{
                  from: exportState.fromDate.start,
                  to: exportState.fromDate.end,
                }}
              />
            </div>
            <div className="w-1/2 ml-3">
              <DatePickerComponent
                purpose="To"
                setDate={setExportState}
                label="To"
                selectedDate={{
                  from: exportState.toDate.start,
                  to: exportState.toDate.end,
                }}
              />
            </div>
          </div>
          <div className="w-1/2 mt-2">
            <CountryListSelector
              exportState={exportState}
              setExportState={setExportState}
              label="Select country"
            />
          </div>
          <span className="w-full self-center flex flex-row justify-end mt-9">
            <ButtonGroup>
              {error ? (
                <div className="mr-4">
                  <InlineError message={errorText} fieldID="-" />
                </div>
              ) : null}
              <CancelButton action={() => setOpenState(false)} />
              <ActionButton
                loading={
                  fetcher.state == "loading"
                    ? true
                    : fetcher.state == "submitting"
                      ? true
                      : false
                }
                heading={"Export"}
                action={primaryAction}
              />
            </ButtonGroup>
          </span>
        </section>
      </div>
    </div>
  );
};

export default ExportPopUp;
