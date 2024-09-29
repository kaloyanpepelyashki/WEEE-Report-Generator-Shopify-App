import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, useActionData, useSubmit } from "@remix-run/react";
import { Page } from "@shopify/polaris";
import { useEffect, useState } from "react";
import collections from "~/Data/Collections";
import CollectionsService from "~/Services/CollectionsService";
import onBoardingService, {
  OnBoardingService,
} from "~/Services/OnBoardingService";
import { authenticate } from "~/shopify.server";
import ActionButton from "~/UI Components/Atomic Components/ActionButton";
import OnBoardingCheckBox from "~/UI Components/Atomic Components/OnBoardingCheckBox";
import OnboardingLayout from "~/UI Components/Global Components/Onboarding-Layout";
import Alert from "~/UI Components/Small Components/Alert";
import ConfirmationPopUp from "~/UI Components/Small Components/ConfirmationPopUp";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  //From session are being extracted
  //"shop" - shopify host name
  //"accessToken" - the shopify api key
  const { session, redirect } = await authenticate.admin(request);

  const requestBody: Array<Map<string, string>> = await request.json();

  //Check if the requestBody is empty
  if (requestBody && requestBody.length > 0) {
    const { accessToken, shop } = session;
    const collectionsService: CollectionsService = new CollectionsService(
      accessToken,
      shop,
    );

    try {
      const response = await collectionsService.createColletions(requestBody);

      console.log("Collections created successfully");

      if (response.isSuccess) {
        const onBoardingServiceProvider: OnBoardingService = onBoardingService;

        const updateOnBoardingState: boolean =
          await onBoardingServiceProvider.setShopOnBoardingState(shop);

        if (updateOnBoardingState) {
          return redirect(`/app/?${url.searchParams.toString()}`);
        }
      } else {
        console.log("Could not create collections, try again");
        return json({
          isError: true,
          status: 500,
          error: "Could not create collections",
        });
      }
    } catch (e: any) {
      console.log(`Error creating collections: ${e}`);
      console.error(e);
      return json({
        isError: true,
        status: 500,
        error: e.message,
      });
    }
  }

  return json({
    isError: true,
    status: 400,
    error: "Could not create collections",
  });
};

const OnBoardingSecond: React.FC = () => {
  //State hooks
  const [togglePopUp, setTogglePopUp] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<boolean>(false);
  const [actionError, setActionError] = useState<boolean>(false);
  const [selectedCollections, setSelectedCollections] = useState<
    Array<Map<string, string>>
  >([]);

  //Remix hooks
  const submit = useSubmit();
  //The data returned from the action
  const actionData = useActionData<typeof action>();

  const collectionsData = collections;

  const handleSelectCollection = (
    title: string,
    description: string,
    checked: boolean,
  ) => {
    const collectionItemMap: Map<string, string> = new Map<string, string>();
    collectionItemMap.set(title, description);

    setSelectedCollections((prevCheckedItems) => {
      if (checked) {
        const entryExists: boolean = prevCheckedItems.some((item) =>
          item.has(title),
        );
        if (!entryExists) {
          return [...prevCheckedItems, collectionItemMap];
        }
      } else {
        return prevCheckedItems.filter((item) => !item.get(title));
      }
      return prevCheckedItems;
    });
  };

  const handleFinish = () => {
    if (selectedCollections && selectedCollections.length > 0) {
      setTogglePopUp(true);
    } else {
      setValidationError(true);
    }
  };

  const handleSetUpCollections = async () => {
    if (selectedCollections && selectedCollections.length > 0) {
      try {
        submit(
          JSON.stringify(
            selectedCollections.map((map) => Object.fromEntries(map)),
          ),
          {
            replace: true,
            method: "POST",
            encType: "application/json",
          },
        );
        setTogglePopUp(false);
      } catch (e) {
        setActionError(true);
        window.alert("Error submitting data");
      }
    } else {
      setActionError(true);
    }
  };

  useEffect(() => {
    if (actionData?.isError) {
      setActionError(true);
    }
  }, [actionData]);

  return (
    <>
      {togglePopUp ? (
        <ConfirmationPopUp
          finishAction={handleSetUpCollections}
          setOpenState={setTogglePopUp}
        />
      ) : (
        " "
      )}
      {/* //! ERROR ALERT COMPONENTS  */}
      {validationError ? (
        <Alert
          heading="Please choose categories"
          bodyText="You need to select at least one category to proceed"
          setOpenState={setValidationError}
          isWarning={true}
        />
      ) : actionError ? (
        <Alert
          heading="Error completing onboarding"
          bodyText="Please try again later!"
          setOpenState={setActionError}
          isError={true}
        />
      ) : (
        ""
      )}
      <Page fullWidth={true}>
        <OnboardingLayout
          heading="What categories do you follow?"
          smallHeading="For the purpose of industry regulation, what categories your products fall in: (select more than one)"
          currentStep={2}
          totalSteps={2}
        >
          <div className="options-holder w-full h-2/3 flex flex-col items-start justify-between overflow-y-scroll pl-2 pt-2 pr-4">
            {collectionsData.map((collection) => {
              return (
                <OnBoardingCheckBox
                  key={collection.id}
                  displayTitle={collection.displayTitle}
                  title={collection.title}
                  description={collection.description}
                  handleSelectCollection={handleSelectCollection}
                />
              );
            })}
          </div>
          <div className="w-80 flex flex-col justify-center mt-5 self-center">
            <ActionButton heading="Finish" action={handleFinish} />
          </div>
        </OnboardingLayout>
      </Page>
    </>
  );
};

export default OnBoardingSecond;
