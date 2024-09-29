import { useCallback, useEffect, useState } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import type Product from "~/Models/Product";
import ProductsService from "~/Services/ProductsService.";
import ItemsSlider from "~/UI Components/Global Components/ItemsSlider";
import { Page } from "@shopify/polaris";
import CollectionsService from "~/Services/CollectionsService";
import Collection from "../Models/Collection";
import CollectionItemCard from "~/UI Components/Small Components/CollectionItemCard";
import { DndContext } from "@dnd-kit/core";
import type { OnBoardingService } from "~/Services/OnBoardingService";
import onBoardingService from "~/Services/OnBoardingService";
import ExportStateType from "~/Models/ExportStateType";
import InstructinsPopUp from "~/UI Components/Small Components/InstructionsPopUp";
import {
  debounce,
  pushProductsToCollection,
} from "~/Helpers/app.index.helpers/index.helpers";
import CollectionsSlider from "~/UI Components/Global Components/CollectionsSlider";
import AddCollectionsModal from "~/routes/app.add-collections-modal";
import Alert from "~/UI Components/Small Components/Alert";
import ExportModalRoute from "./app.export-modal-route";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, redirect } = await authenticate.admin(request);

  const onBoardingServiceProvider: OnBoardingService = onBoardingService;

  //From session are being extracted
  //"shop" - shopify host name
  //"accessToken" - the shopify api key
  const { shop, accessToken } = session;

  //Checks if the user has finished the onboarding process (pulls data from the database)
  const hasCompletedOnBoarding: boolean =
    await onBoardingServiceProvider.isShopOnBoardingStateValid(shop);

  if (hasCompletedOnBoarding) {
    try {
      //? If the user has completed the onboarding process
      const productsService = new ProductsService(
        accessToken as string,
        shop as string,
      );

      const collectionsService: CollectionsService = new CollectionsService(
        accessToken as string,
        shop as string,
      );

      const collectionsFetchResponse: {
        isSuccess: boolean;
        status: number;
        payload: Array<Collection>;
        message?: string;
      } = await collectionsService.getWeeeCollections();

      const productsFetchResponse: {
        isSuccess: boolean;
        status: number;
        payload: Array<Product> | null;
        message?: string;
      } = await productsService.getAllShopProducts();

      console.log(
        "collectionsFetchResponse in loader: ",
        collectionsFetchResponse,
      );

      if (
        collectionsFetchResponse.isSuccess &&
        productsFetchResponse.isSuccess
      ) {
        const collectionsList = collectionsFetchResponse.payload;
        const productsList = productsFetchResponse.payload;

        //? If the user has finished the onboarding flow, it returns the needed information to render the index page
        return {
          isSuccess: true,
          status: 200,
          payload: {
            productsList: productsList,
            collectionsList: collectionsList,
            shop: shop,
            accessToken: accessToken,
          },
        };
      } else {
        if (collectionsFetchResponse.message) {
          console.log(
            "Error in loader. Problem fetching collections: ",
            collectionsFetchResponse.message,
          );
        }
        if (productsFetchResponse.message) {
          console.log(
            "Error in loader. Problem fetching products: ",
            productsFetchResponse.message,
          );
        }

        return {
          isSuccess: false,
          status: 0,
          payload: {
            productsList: [],
            collectionsList: [],
            shop: shop,
            accessToken: accessToken,
          },
        };
      }
    } catch (e) {
      console.error("Error loading data in loader: ", e);
      return {
        isSuccess: false,
        status: 500,
        payload: {
          productsList: [],
          collectionsList: [],
          shop: shop,
          accessToken: accessToken,
        },
      };
    }
  }

  const url = new URL(request.url);
  //? Redirects the user to the onboarding flow routes.
  return redirect(
    `/app/onboarding-initial-step/?${url.searchParams.toString()}`,
  );
};

export default function Index() {
  const { isSuccess, payload } = useLoaderData<typeof loader>();
  const [items, setItems] = useState<Array<Product>>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  const [sections, setSections] = useState(() => {
    if (isSuccess) {
      const initialSection: Record<string, any> = {};
      if (payload.collectionsList && payload.collectionsList.length > 0) {
        payload.collectionsList.forEach((collection) => {
          initialSection[collection.id] = [];
        });

        return initialSection;
      }
    }
  });

  const [modalOpenState, setModalOpenState] = useState<boolean>(false);
  const [instructionsModalOpenState, setInstructionsModalOpenState] =
    useState<boolean>(false);
  const [addCollectionsModalOpenState, setAddCollectionsModalOpenState] =
    useState<boolean>(false);

  const [exportState, setExportState] = useState<ExportStateType>({
    fromDate: { start: null, end: null },
    toDate: { start: null, end: null },
    targetCountry: null,
  });

  const [emptyFiledsError, setEmptyFieldsError] = useState<boolean>(false);

  const [exportErrorAlert, setExportErrorAlert] = useState<boolean>(false);

  const fetcher = useFetcher();

  const handleDebounce = debounce(pushProductsToCollection, 500);

  const handleDragEvent = (event) => {
    const { active, over } = event;
    if (over && over.id != "originalList") {
      setSections((prevSections) => {
        const newSections = { ...prevSections };
        Object.keys(newSections).forEach((key) => {
          newSections[key] = newSections[key].filter(
            (item: any) => item.id !== active.id,
          );
        });
        newSections[over.id].push(items.find((item) => item.id === active.id));
        return newSections;
      });
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== active.id),
      );

      handleDebounce(over.id, [active.id.toString()], {
        accessToken: payload.accessToken,
        shop: payload.shop,
      });
    } else if (over && over.id == "originalList") {
      // Return the item to the original list
      setItems((prevItems) => [
        ...prevItems,
        items.find((item) => item.id === active.id),
      ]);

      // Remove item from sections
      setSections((prevSections) => {
        const newSections = { ...prevSections };
        Object.keys(newSections).forEach((key) => {
          newSections[key] = newSections[key].filter(
            (item: any) => item.id !== active.id,
          );
        });
        return newSections;
      });
    }

    return;
  };

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
      setModalOpenState(false);
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
        },
      );
    }

    setEmptyFieldsError(true);
  };

  useEffect(() => {
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    if (isSuccess && payload.productsList) {
      setItems(payload.productsList);
    } else {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (emptyFiledsError) {
      setExportErrorAlert(true);
    }
  }, [emptyFiledsError]);

  return (
    <DndContext onDragEnd={handleDragEvent}>
      <Page fullWidth={true}>
        {instructionsModalOpenState ? (
          <InstructinsPopUp setOpenState={setInstructionsModalOpenState} />
        ) : null}
        {exportErrorAlert ? (
          <Alert
            heading="Empty fields"
            bodyText="Please fill out all export fields"
            isWarning={true}
            setOpenState={setExportErrorAlert}
          />
        ) : null}
        {modalOpenState ? (
          <ExportModalRoute setOpenState={setModalOpenState} />
        ) : null}
        {addCollectionsModalOpenState ? (
          <AddCollectionsModal
            triggerRefresh={setRefresh}
            setOpenState={setAddCollectionsModalOpenState}
          />
        ) : null}
        <main className="w-full h-full">
          <div className="w-full mt-10">
            {/*   <button className="export-button text-white py-2.5 px-4 rounded-xl font-bold bg-btnColor shadow-customSmall hover:scale-110">
              Save
            </button> */}
            {isSuccess && items.length ? (
              /** This is the component that displays products from vendor's store as draggable card components */
              <ItemsSlider
                action={{
                  openExportModal: () => setModalOpenState(true),
                  openInstructionsModal: () =>
                    setInstructionsModalOpenState(true),
                }}
                shop={payload.shop}
                storeProducts={items}
                title="Store products"
              />
            ) : (
              <h2>No products found</h2>
            )}
          </div>
          <div className="h-full flex flex-row items-start px-6 py-3 mt-5 overflow-x-scroll">
            <CollectionsSlider
              collections={payload.collectionsList}
              sections={sections}
              session={{
                shop: payload.shop,
                accessToken: payload.accessToken,
              }}
              title="Categories"
              action={() => setAddCollectionsModalOpenState(true)}
            />
          </div>
        </main>
      </Page>
    </DndContext>
  );
}
