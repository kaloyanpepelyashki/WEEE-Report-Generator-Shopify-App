import { Link } from "@remix-run/react";
import { Icon } from "@shopify/polaris";
import { ArrowRightIcon } from "@shopify/polaris-icons";
import { useState } from "react";

type OnBoardingButtonProps = {
  heading: string;
  bodyText: string;
  isPrimary: boolean;
  navigationPath: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};

const OnBoardingButton: React.FC<OnBoardingButtonProps> = ({
  heading,
  bodyText,
  isPrimary,
  navigationPath,
  icon,
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setTimeout(() => {
      setFocused(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setFocused(false);
    }, 300);
  };

  return (
    <>
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        type="button"
        className="onboarding-button-wrapper onboarding-button w-3/5 h-2/5 mb-3 border-sky-400 rounded-lg hover:border bg-white hover:bg-sky-100"
      >
        <div className="w-full h-full flex flex-row justify-between px-3 py-5">
          <Icon tone="base" source={icon} />
          <div className="onboarding-button-text-holder w-2/3 flex flex-col items-start px-2">
            <h4 className="onboarding-button-heading w-full font-bold font-md text-left">
              {heading}
            </h4>
            <p className="onboarding-button-body-text w-full text-sm text-left">
              {bodyText}
            </p>
          </div>
          <div className="w-1/5 flex flex-row items-center justify-end pr-3">
            {focused && isPrimary ? (
              <Link to="/app/onboarding-second-step">
                <ArrowRightIcon
                  className="transition-all hover:scale-125 text-red"
                  width="1.5rem"
                />
              </Link>
            ) : (
              " "
            )}
          </div>
        </div>
      </button>
    </>
  );
};

export default OnBoardingButton;
