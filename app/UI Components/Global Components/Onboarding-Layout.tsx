import { ReactNode } from "react";
import BackButton from "../Atomic Components/BackButton";
import { Divider } from "@shopify/polaris";

type OnBoardingProps = {
  children: ReactNode;
  heading: string;
  smallHeading: string;
  currentStep: number;
  totalSteps: number;
};

const OnboardingLayout: React.FC<OnBoardingProps> = ({
  children,
  heading,
  smallHeading,
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="flex flex-row" style={{ display: "flex", height: "100vh" }}>
      <div
        className="w-2/5"
        style={{
          backgroundImage:
            "url(https://i.insider.com/51643ba7eab8ea0538000003?width=750&format=jpeg&auto=webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Left side with image */}
      </div>
      <div className="w-3/5 h-full px-10">
        {/* Right side */}
        <div className="w-full flex flex-row items-end justify-between">
          <BackButton />
          <h4 className="text-md flex flex-row">
            Welcome to WEEE Report exporter
            <p className="ml-1 text-sky-600">
              Step {currentStep}/{totalSteps}
            </p>
          </h4>
        </div>
        <div className="layout-children-holder w-full h-full flex flex-col items-start justify-center mt-8 pl-20">
          <div className="onboarding-initial-actions-holder w-3/4 h-full flex flex-col align-start">
            <div className=" flex flex-col align-start mb-5">
              <h1 className="font-bold text-2xl">{heading}</h1>
              <p className="w-full text-lg mt-3">{smallHeading}</p>
              <Divider />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
