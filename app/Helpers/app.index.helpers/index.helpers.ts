import CollectionsService from "~/Services/CollectionsService";

export function debounce(callBack, waitTime: number) {
  let timer: NodeJS.Timeout;

  return (...args) => {
    //Resets the timer, each time the function is called.
    //That ensures the callBack function will only trigger after the waitTime has expired
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await callBack(...args);
    }, waitTime);
  };
}

export const pushProductsToCollection = async (
  collectionId: string,
  productIds: Array<string>,
  credentials: { accessToken: string; shop: string },
) => {
  const collectionsManager = new CollectionsService(
    credentials.accessToken,
    credentials.shop,
  );

  console.log("collection id in pushProductsToCollection: ", collectionId);
  const result = await collectionsManager.addProductsToCollection(
    collectionId,
    productIds,
  );

  if (result.isSuccess) {
    return true;
  }

  console.log(
    "Error pushing products to collection. Status: %d; Message: %s",
    result.status,
    result.message,
  );
  return false;
};
