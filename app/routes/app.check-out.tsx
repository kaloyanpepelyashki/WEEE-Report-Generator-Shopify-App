import { PDFDownloadLink } from "@react-pdf/renderer";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Spinner } from "@shopify/polaris";
import { useEffect, useState } from "react";
import type Collection from "~/Models/Collection";
import CollectionsService from "~/Services/CollectionsService";
import ReportService from "~/Services/ReportService";
import { authenticate } from "~/shopify.server";
import ActionButton from "~/UI Components/Atomic Components/ActionButton";
import BackButton from "~/UI Components/Atomic Components/BackButton";
import ExportDocument from "~/UI Components/Documents/ExportDocument";
import Alert from "~/UI Components/Small Components/Alert";
import ReportErrorBanner from "~/UI Components/Small Components/ReportErrorBanner";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  //From session are being extracted
  //"shop" - shopify host name
  // "accessToke" - access token
  const { shop, accessToken } = session;
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);

  const fromDate = params.get("fromDate");
  const toDate = params.get("toDate");
  const targetCountry = params.get("targetCountry");

  if (!fromDate || !toDate || !targetCountry) {
    return json({
      isSuccess: false,
      status: 400,
      message: "Invalid payload",
      body: null,
    });
  }

  const collectionsService: CollectionsService = new CollectionsService(
    accessToken as string,
    shop as string,
  );

  const collectionsList = await collectionsService.getWeeeCollections();

  const reportService: ReportService = new ReportService(accessToken, shop);

  try {
    const report = await reportService.getReportFor(
      collectionsList.payload.map((collection: Collection) => collection.title),
      fromDate,
      toDate,
      targetCountry,
    );

    if (!report.isSuccess) {
      json({
        isSuccess: false,
        status: report.status,
        message: "Ok",
        body: {
          shop: shop,
          totalWeights: Array.from(report.payload.totalWeights.entries()),
          ordersCount: report.payload.orderCounts,
        },
      });
    }

    if (report.isSuccess && report.payload.totalWeights) {
      return json({
        isSuccess: true,
        status: 200,
        message: "Ok",
        body: {
          shop: shop,
          totalWeights: Array.from(report.payload.totalWeights.entries()),
          ordersCount: report.payload.orderCounts,
        },
      });
    }

    return json({
      isSuccess: false,
      status: 422,
      message: "Report generation failed",
      body: null,
    });
  } catch (e) {
    console.error("Error generating report", e);
    return json({
      isSuccess: false,
      status: 500,
      message: "Internal server error",
      body: null,
    });
  }
};

const CheckOut: React.FC = () => {
  const loaderData = useLoaderData<typeof loader>();

  const [reportPayload, setReportPayload] = useState<Map<
    string,
    number
  > | null>(null);
  const [ordersCount, setOrdersCount] = useState<number | null>(0);
  const [shop, setShop] = useState<string>("");
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [reportError, setReportError] = useState<boolean>(false);
  const [errorModalOpenState, setErrorModalOpenState] =
    useState<boolean>(false);

  useEffect(() => {
    if (loaderData.isSuccess && loaderData.status == 200 && loaderData.body) {
      try {
        //Creating a new Map, that is being set as the reportPayload state
        setReportPayload(new Map(loaderData.body?.totalWeights));
        setOrdersCount(loaderData.body?.ordersCount);
        setShop(loaderData.body.shop);
        setPageLoading(false);
      } catch (e: any) {
        console.log("Unexpected error: ", e);
        setPageLoading(false);
        setReportError(false);
      }
    } else {
      console.log("Loader data: ", loaderData);
      setPageLoading(false);
      setReportError(true);
      setErrorModalOpenState(true);
    }
  }, [loaderData]);

  const dateObj = new Date();
  const date =
    dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
  const month =
    dateObj.getMonth() < 10
      ? `0${dateObj.getMonth() + 1}`
      : dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();

  const fileName = `WEEE-Report-${date}/${month}/${year}`;

  return (
    <Page fullWidth={true}>
      {errorModalOpenState ? (
        <Alert
          heading="Error"
          bodyText="Problem generating report"
          setOpenState={setErrorModalOpenState}
          isError={true}
        />
      ) : null}

      <main className="w-full h-full flex flex-col items-center justify-center">
        {pageLoading ? (
          <Spinner accessibilityLabel="Generating report" size="large" />
        ) : (
          <div className="w-full h-full flex flex-col">
            {reportError ? (
              <div>
                <div className="check-out-page-top-section w-full flex flex-row justify-between pb-4">
                  <BackButton />
                </div>
                <div className="mt-36">
                  <ReportErrorBanner />
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="check-out-page-top-section w-full flex flex-row justify-between pb-4">
                  <BackButton />
                  <div>
                    <PDFDownloadLink
                      document={
                        <ExportDocument
                          reportPayload={reportPayload}
                          date={`${date}/${month}/${year}`}
                          shopName={shop as string}
                        />
                      }
                      fileName={fileName}
                    >
                      {({ loading }) =>
                        loading ? (
                          <h2>Loadin</h2>
                        ) : (
                          <ActionButton heading={"Export"} action={() => {}} />
                        )
                      }
                    </PDFDownloadLink>
                  </div>
                </div>
                {ordersCount && ordersCount >= 250 ? (
                  <div className="pdf-document-preview-wrapper w-1/2 relative flex flex-col items-center justify-center p-3 rounded-md bg-primary blur-sm">
                    <ExportDocument
                      reportPayload={reportPayload}
                      date={`${date}/${month}/${year}`}
                      shopName={shop as string}
                    />
                  </div>
                ) : (
                  <div className="pdf-document-preview-wrapper w-1/3 relative flex flex-col items-center justify-center p-3 rounded-md bg-primary ">
                    <ExportDocument
                      reportPayload={reportPayload}
                      date={`${date}/${month}/${year}`}
                      shopName={shop as string}
                    />
                  </div>
                )}
                <div className="mt-10"></div>
              </div>
            )}
          </div>
        )}
      </main>
    </Page>
  );
};

export default CheckOut;
