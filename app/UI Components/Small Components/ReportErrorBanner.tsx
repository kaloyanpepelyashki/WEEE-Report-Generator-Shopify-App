import { XCircleIcon } from "@shopify/polaris-icons";

const ReportErrorBanner: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <XCircleIcon width={100} />
      <h3 className="text-lg font-medium mt-3">Error generating report</h3>
    </div>
  );
};

export default ReportErrorBanner;
