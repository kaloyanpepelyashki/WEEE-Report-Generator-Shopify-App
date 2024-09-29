import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Banner, Page } from "@shopify/polaris";
import { GlobeEUFilledIcon, GlobeEUIcon } from "@shopify/polaris-icons";
import { authenticate } from "~/shopify.server";
import OnBoardingButton from "~/UI Components/Atomic Components/OnBoardingButton";
import OnboardingLayout from "~/UI Components/Global Components/Onboarding-Layout";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

const OnBoardingInitial: React.FC = () => {
  return (
    <Page fullWidth={true}>
      <div className="overflow-y-hidden">
        <OnboardingLayout
          heading="First of all!"
          smallHeading="This app is made with European countries in mind, that follow the WEEE regulamants. If you are not an EU country, look for another app."
          currentStep={1}
          totalSteps={2}
        >
          <div className="h-3/4 flex flex-col justify-between">
            <div>
              <div className="mt-5">
                <OnBoardingButton
                  heading="I am in a EU country"
                  bodyText="I reside or own a business within a EU country"
                  isPrimary={true}
                  icon={GlobeEUFilledIcon}
                  navigationPath={"/app/onboarding-second-step"}
                />
              </div>
              <div className="mt-5">
                <Link to={"/app/non-eu-fallback"}>
                  <OnBoardingButton
                    heading="I am NOT ina EU country"
                    bodyText="I don't reside or own a business withing a EU country"
                    isPrimary={false}
                    icon={GlobeEUIcon}
                    navigationPath={"/app/onboarding-second-step"}
                  />
                </Link>
              </div>
            </div>
            <div className="w-full disclaimer-holder-section w-full place-self-end mb-3">
              <Banner tone="info">
                <p className="w-full text-xxs font-bold">
                  This application is designed to assist electronics vendors in
                  generating reports that calculate the total weight of
                  electronic products sold through their Shopify store. The
                  purpose of these reports is to facilitate the accurate
                  reporting of electronic waste data to the appropriate European
                  Union WEEE (Waste Electrical and Electronic Equipment)
                  regulatory bodie
                </p>
              </Banner>
            </div>
          </div>
        </OnboardingLayout>
      </div>
    </Page>
  );
};

export default OnBoardingInitial;
