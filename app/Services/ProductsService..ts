import Product from "~/Models/Product";

/**
 * This class serves as an entry point to all methods related to the Shopify Product object
 * All products are fetched from the API server
 */
class ProductsService {
  protected serverUrl: string;
  protected accessToken: string;
  protected hostName: string;

  constructor(accessToken: string, hostName: string) {
    this.serverUrl = process.env.API_URL || " ";
    this.accessToken = accessToken;
    this.hostName = hostName;
  }

  /**
   * This method is in charge of getting all active products in vendor's store.
   * The method contacts the API and fetches all products belonging to vendor's store
   * @param
   * @returns {Array<Product> | null} An array of all active products in vendor's store or null
   */
  public async getAllShopProducts(): Promise<{
    isSuccess: boolean;
    status: number;
    payload: Array<Product> | null;
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.serverUrl}/products/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": this.accessToken,
          "host-name": this.hostName,
        },
      });

      if (response.status == 200) {
        const data = await response.json();
        const productsList: Product[] = data.map(
          (product: any) =>
            new Product(
              product.id,
              product.title,
              product.weight,
              product.imageId,
              product.imageUrl,
            ),
        );
        return {
          isSuccess: true,
          status: response.status,
          payload: productsList,
        };
      } else if (response.status == 500) {
        return {
          isSuccess: false,
          status: response.status,
          payload: [],
          message: "Could not fetch products: Internal Server Error",
        };
      }

      return { isSuccess: false, status: response.status, payload: [] };
    } catch (e: any) {
      console.log("Error getting all shop products: ", e.message);
      return { isSuccess: false, status: 500, payload: [], message: e.message };
    }
  }

  /**
   * This method is in charge of getting all products belonging to a collection.
   * The method contacts the API and fetches all products belonging to a collection in vendor's store
   * @param collectionId
   * @returns
   */
  public async getAllProductsForCollection(collectionId: string): Promise<{
    isSuccess: boolean;
    status: number;
    payload: Array<Product> | null;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${this.serverUrl}/collection/${collectionId}/products/all`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "access-token": this.accessToken,
            "host-name": this.hostName,
          },
        },
      );

      if (response.status == 200) {
        const data = await response.json();

        const productsList: Array<Product> = data.map(
          (product: any) =>
            new Product(
              product.id,
              product.title,
              product.weight,
              product.imageId,
              product.imageUrl,
            ),
        );

        return {
          isSuccess: true,
          status: response.status,
          payload: productsList,
        };
      } else if (response.status == 404) {
        return {
          isSuccess: true,
          status: response.status,
          payload: [],
        };
      } else if (response.status == 500) {
        return {
          isSuccess: false,
          status: response.status,
          payload: [],
          message:
            "Error getting collection products. Server responded with status 500, Internal server error.",
        };
      } else {
        return {
          isSuccess: false,
          status: response.status,
          payload: [],
          message: `Error getting collection products. Server responded with status ${response.status}`,
        };
      }
    } catch (e: any) {
      console.error("Error geting all products for collection: ", e);
      return { isSuccess: false, status: 0, payload: [], message: e.message };
    }
  }
}

export default ProductsService;
