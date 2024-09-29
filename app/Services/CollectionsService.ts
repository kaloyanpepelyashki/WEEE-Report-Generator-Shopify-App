import Collection from "~/Models/Collection";

/**
 * This class serves as an entry point to all methods related to the Shopify Xollection object
 * All products are fetched from the API server
 */
class CollectionsService {
  private url: string;
  protected accessToken: string;
  protected hostName: string;

  constructor(accessToken: string, hostName: string) {
    this.url = process.env.API_URL || " ";
    this.accessToken = accessToken;
    this.hostName = hostName;
  }
  /**
   * This method sends a post request to the endpoint for creating collections in the Shopify Admin
   * The method expexts to receive an array of Map<string, string> where the key is collection title and the value is collection description
   * @param collections
   * @returns
   */
  public async createColletions(
    collections: Array<Map<string, string>>,
  ): Promise<{ isSuccess: boolean; status: number; message?: string }> {
    try {
      const result = await fetch(`${this.url}/createCollection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": this.accessToken,
          "host-name": this.hostName,
        },
        body: JSON.stringify(collections),
      });

      if (result.status === 200 || result.status === 201) {
        return { isSuccess: true, status: result.status };
      } else if (result.status === 500) {
        return {
          isSuccess: false,
          status: result.status,
          message:
            "Error creating collections.  Server responded with status 500, Internal server error.",
        };
      }
      return {
        isSuccess: false,
        status: result.status,
        message: "Error creating collectons",
      };
    } catch (e: any) {
      console.log("Error creating collections: ", e.message);
      return { isSuccess: false, status: 0, message: e.message };
    }
  }

  /**
   * The method sends a get request to the endpoint for getting all collections
   * The method expects not parameters and returns an object
   * @returns isSuccess: true/false, status: status code returned by the server, payload: the data returned from the server or null in case of error, message: message send by the server or error message
   */
  public async getWeeeCollections(): Promise<{
    isSuccess: boolean;
    status: number;
    payload: Array<Collection>;
    message?: string;
  }> {
    try {
      const result: Response = await fetch(`${this.url}/weeeCollections/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "access-token": this.accessToken,
          "host-name": this.hostName,
        },
      });

      console.log(
        "result in getWeeeCollections in CollectionsService: ",
        result,
      );

      if (result.status == 200) {
        const collectionsObj = await result.json();
        const collections: Array<Collection> = collectionsObj.map(
          (collection: any) =>
            new Collection(
              collection.id,
              collection.title,
              collection.description,
            ),
        );
        return { isSuccess: true, status: result.status, payload: collections };
      } else if (result.status === 500) {
        console.log(`Error getting weee collections ${result.status}`);
        return {
          isSuccess: false,
          status: result.status,
          payload: [],
          message:
            "Error getting collections. Server responded with status 500, Internal server error.",
        };
      } else if (result.status === 404) {
        return { isSuccess: true, status: result.status, payload: [] };
      }

      console.log("Error getting collections");
      return {
        isSuccess: false,
        status: result.status,
        payload: [],
        message: "Error getting collections",
      };
    } catch (e: any) {
      console.log(
        "Error in collections service. Error getting collections: ",
        e.message,
      );
      return { isSuccess: false, status: 0, payload: [], message: e.message };
    }
  }

  public async addProductsToCollection(
    collectionId: string,
    products: Array<string>,
  ): Promise<{
    isSuccess: boolean;
    status: number;
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.url}/addProductsToCollection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": this.accessToken,
          "host-name": this.hostName,
        },
        body: JSON.stringify({ collection: collectionId, products: products }),
      });

      console.log(response);
      const body = await response.json();
      console.log("body: ", body);
      const message = body.message;

      if (response.status === 200) {
        return { isSuccess: true, status: 200, message: message };
      }

      console.log(
        "Response does not seem to be success: ",
        response.status,
        message,
      );
      return { isSuccess: false, status: response.status, message: message };
    } catch (e: any) {
      console.error(
        "Error in CollectionsService, addProductsToCollection: ",
        e,
      );
      return { isSuccess: false, status: 0, message: e.message };
    }
  }

  public async removeProductsFromCollection(
    collectionId: string,
    products: Array<string>,
  ): Promise<{ isSuccess: boolean; status: number; message?: string }> {
    try {
      const response = await fetch(`${this.url}/removeProductsFromCollection`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": this.accessToken,
          "host-name": this.hostName,
        },
        body: JSON.stringify({ collection: collectionId, products: products }),
      });

      const body = await response.json();
      const message = body.message;

      if (response.status === 200) {
        return { isSuccess: true, status: 200, message: message };
      }

      console.log(
        "Response does not seem to be success: ",
        response.status,
        message,
      );
      return { isSuccess: false, status: response.status, message: message };
    } catch (e: any) {
      return { isSuccess: false, status: 0, message: e.message };
    }
  }
}

export default CollectionsService;
