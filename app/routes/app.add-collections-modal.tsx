import { ButtonGroup, Divider, InlineError } from "@shopify/polaris";
import collections from "~/Data/Collections";
import CancelButton from "../UI Components/Atomic Components/CancelButton";
import ActionButton from "../UI Components/Atomic Components/ActionButton";
import OnBoardingCheckBox from "../UI Components/Atomic Components/OnBoardingCheckBox";
import CloseButton from "../UI Components/Atomic Components/CloseButton";
import { useEffect, useState } from "react";
import { ActionFunctionArgs, json } from "@remix-run/node";
import CollectionsService from "~/Services/CollectionsService";
import { useFetcher } from "@remix-run/react";
import { authenticate } from "~/shopify.server";

type AddCollectionsModalProps = {
  setOpenState: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  //From session are being extracted
  //"shop" - shopify host name
  //"accessToken" - the shopify api key
  const { session } = await authenticate.admin(request);

  //An array of collections to be created.
  const requestBody: Array<Map<string, string>> = await request.json();

  //Check if the requestBody is empty
  if (requestBody && requestBody.length > 0) {
    const { accessToken, shop } = session;
    const collectionsService: CollectionsService = new CollectionsService(
      accessToken,
      shop,
    );

    try {
      //Sends an HTTP request to the server, requesting to create collections
      const response = await collectionsService.createColletions(requestBody);

      console.log("Collections created successfully through the modal");

      if (response.isSuccess) {
        return { isSuccess: true, status: 200, error: null };
      } else {
        return {
          isSuccess: false,
          status: 500,
          error: "Could not create collections",
        };
      }
    } catch (e: any) {
      console.log(`Error creating collections: ${e}`);
      console.error(e);
      return {
        isSuccess: false,
        status: 500,
        error: e.message,
      };
    }
  }

  return json({
    isSuccess: false,
    status: 400,
    error: "Could not create collections",
  });
};

const AddCollectionsModal: React.FC<AddCollectionsModalProps> = ({
  setOpenState,
  triggerRefresh,
}) => {
  const [selectedCollections, setSelectedCollections] = useState<
    Array<Map<string, string>>
  >([]);

  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const collectionsData = collections;

  const fetcher = useFetcher();

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

  const handleSetUpCollections = async () => {
    if (selectedCollections && selectedCollections.length > 0) {
      try {
        fetcher.submit(
          JSON.stringify(
            selectedCollections.map((map) => Object.fromEntries(map)),
          ),
          {
            method: "POST",
            action: "/app/add-collections-modal",
            encType: "application/json",
          },
        );
        return;
      } catch (e) {
        console.log("Error creating collections: ", e);
        setErrorText("Error creating collections");
        setError(true);
      }
    }
    setErrorText("You must select at least one collection");
    setError(true);
  };

  useEffect(() => {
    setErrorText("");
    setError(false);
  }, []);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.isSuccess) {
        triggerRefresh(true);
        setOpenState(false);
      }

      setErrorText("Could not create collections.");
      setError(true);
    }
  }, [fetcher.state]);

  return (
    <div className="w-full h-full absolute flex flex-col justify-center items-center z-50">
      <div className="confirmation-pop-up-blur-background w-full h-full absolute bg-slate-300 opacity-45 blur-xl"></div>
      <div className="export-pop-up-wrapper w-7/12 h-2/3 flex flex-col items-start justify-center px-5 py-3 pt-6 z-50 bg-primary rounded-xl">
        <div className="export-pop-up-top-section w-full flex flex-row justify-between items-start pb-3.5">
          <h2 className="text-3xl font-bold ml-4">Add Collections</h2>
          <CloseButton action={() => setOpenState(false)} />
        </div>
        <div className="w-full mb-6">
          <Divider borderWidth="050" borderColor="border-inverse" />
        </div>
        <div className="export-pop-up-options-holder w-full h-2/3 flex flex-col items-start justify-between overflow-y-scroll pl-2 pt-2 pr-4">
          {collectionsData.map((collection) => (
            <OnBoardingCheckBox
              title={collection.title}
              description={collection.description}
              displayTitle={collection.displayTitle}
              handleSelectCollection={handleSelectCollection}
            />
          ))}
        </div>
        <span className="w-full self-center flex flex-row items-center justify-end mt-9">
          {error ? (
            <div className="mr-4">
              <InlineError message={errorText} fieldID="-" />
            </div>
          ) : null}
          <ButtonGroup>
            <CancelButton action={() => setOpenState(false)} />
            <ActionButton
              heading={"Done"}
              action={handleSetUpCollections}
              loading={
                fetcher.state == "loading"
                  ? true
                  : fetcher.state == "submitting"
                    ? true
                    : false
              }
            />
          </ButtonGroup>
        </span>
      </div>
    </div>
  );
};

export default AddCollectionsModal;
