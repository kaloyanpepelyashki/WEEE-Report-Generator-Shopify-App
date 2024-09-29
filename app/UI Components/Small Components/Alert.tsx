import { Banner } from "@shopify/polaris";
import { useEffect } from "react";

type AlertProps = {
  heading: string;
  bodyText: string;
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  isWarning?: boolean;
};

/** This component is in charge of displaying notification alerts (error, warning) */
const Alert: React.FC<AlertProps> = ({
  heading,
  bodyText,
  setOpenState,
  isError,
  isWarning,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setOpenState(false);
    }, 1800);
  });

  const style = {
    marginTop: "-35px",
  };

  return (
    <div
      style={style}
      className="alert-window w-1/4 absolute start-1/3 flex flex-col px-2 py-2 rounded-xl z-50  animate-alert-slide-in"
    >
      {/* <h2 className="text-md font-bold mb-1">{heading}</h2> */}
      <Banner
        title={heading}
        tone={isError ? "critical" : isWarning ? "warning" : "info"}
      >
        <p>{bodyText}</p>
      </Banner>
    </div>
  );
};

export default Alert;
