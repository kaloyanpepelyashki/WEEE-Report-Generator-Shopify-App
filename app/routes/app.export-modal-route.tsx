import { ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import ExportStateType from "~/Models/ExportStateType";
import { authenticate } from "~/shopify.server";
import ExportPopUp from "~/UI Components/Small Components/ExportPopUp";

type ExportModalRouteProps = {
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { redirect } = await authenticate.admin(request);
  const url = new URL(request.url);

  const exportState = await request.json();

  const fromDateEncoded = encodeURIComponent(exportState.fromDate);
  const toDateEncoded = encodeURIComponent(exportState.toDate);
  const targetCountryEncoded = encodeURIComponent(exportState.targetCountry);

  console.log("Should redirect");
  return redirect(
    `/app/check-out/?${url.searchParams.toString()}&fromDate=${fromDateEncoded}&toDate=${toDateEncoded}&targetCountry=${targetCountryEncoded}`,
  );
};

const ExportModalRoute: React.FC<ExportModalRouteProps> = ({
  setOpenState,
}) => {
  //**  Hook declarations */
  //<- useState hooks
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [exportState, setExportState] = useState<ExportStateType>({
    fromDate: { start: null, end: null },
    toDate: { start: null, end: null },
    targetCountry: null,
  });

  const fetcher = useFetcher();

  //** Function declarations */
  /**
   * This function will trigger data submission to the action function
   * If action responds with success, redirect will be triggered to the check-out page
   */
  const requestReport: () => void = async () => {
    if (
      exportState.fromDate.start &&
      exportState.toDate.start &&
      exportState.targetCountry
    ) {
      //Submitting data to the action function
      fetcher.submit(
        JSON.stringify({
          fromDate: exportState.fromDate.start.toString(),
          toDate: exportState.toDate.start.toString(),
          targetCountry: exportState.targetCountry,
        }),
        {
          method: "POST",
          encType: "application/json",
          action: "/app/export-modal-route",
        },
      );
      return;
    }

    setErrorText("You must fill out fields");
    setErrorState(true);
  };

  useEffect(() => {
    setErrorState(false);
    setErrorText("");
  }, []);

  return (
    <ExportPopUp
      exportState={exportState}
      setExportState={setExportState}
      setOpenState={setOpenState}
      primaryAction={requestReport}
      fetcher={fetcher}
      error={errorState}
      errorText={errorText}
    />
  );
};

export default ExportModalRoute;
