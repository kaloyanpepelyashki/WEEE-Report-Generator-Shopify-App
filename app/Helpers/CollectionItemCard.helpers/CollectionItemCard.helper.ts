import Product from "~/Models/Product";
import ProductsService from "~/Services/ProductsService.";

export async function fetchCollectionProducts(
  accessToken: string,
  shop: string,
  collectionId: string,
): Promise<{
  isSuccess: boolean;
  status: number;
  payload: Array<Product>;
  message?: string;
}> {
  const productsService: ProductsService = new ProductsService(
    accessToken,
    shop,
  );

  const collectionProductsResponse =
    await productsService.getAllProductsForCollection(collectionId);

  if (collectionProductsResponse.isSuccess) {
    return collectionProductsResponse;
  }

  return {
    isSuccess: false,
    status: collectionProductsResponse.status,
    payload: [],
    message: collectionProductsResponse.message,
  };
}

export function extractCollectionNumericId(collectionId: string) {
  const regex = /\/(\d+)$/;
  const match = collectionId.match(regex);

  if (match) {
    return match[1];
  }

  return " ";
}
