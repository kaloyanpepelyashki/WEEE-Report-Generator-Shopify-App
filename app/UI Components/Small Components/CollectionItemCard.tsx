import { useDroppable } from "@dnd-kit/core";
import { Divider, InlineError, Text } from "@shopify/polaris";
import type Collection from "~/Models/Collection";
import ProductItemCard from "./ProductItemCard";
import { useEffect, useState } from "react";
import {
  extractCollectionNumericId,
  fetchCollectionProducts,
} from "~/Helpers/CollectionItemCard.helpers/CollectionItemCard.helper";
import type Product from "~/Models/Product";

type CollectionItemCardProps = {
  collection: Collection;
  items: Array<any>;
  session: { shop: string; accessToken: string };
};

const CollectionItemCard: React.FC<CollectionItemCardProps> = ({
  collection,
  items,
  session,
}) => {
  const [collectionProducts, setCollectionProducts] = useState<Array<Product>>(
    [],
  );

  const [error, setError] = useState<boolean>(true);
  const [noProductsError, setNoProductsError] = useState<boolean>(false);

  const { isOver, setNodeRef } = useDroppable({
    id: collection?.id,
  });

  const setProducts = async () => {
    const collectionNumericId = extractCollectionNumericId(collection.id);

    const response = await fetchCollectionProducts(
      session.accessToken,
      session.shop,
      collectionNumericId,
    );

    console.log(response);

    if (!response.isSuccess) {
      console.log("Error fetching collection products");
      console.error("Error fetching collection products: ", response.message);
      setError(true);
    }

    if (response.payload?.length <= 0) {
      setNoProductsError(true);
    }

    setCollectionProducts(response.payload);
  };

  useEffect(() => {
    setNoProductsError(false);
    setError(false);
    setProducts();
  }, []);

  // console.log("session: ", session);
  // console.log("collection id", collection.id);

  //TODO Figure out how to mix together the products being dragged and the products fetched from the API
  return (
    <div className="collection-item-card w-80 min-w-72 h-100 px-4 pt-3 mr-6 rounded-md bg-primary">
      <div className="w-full">
        <div className="collection-item-card-top-section w-full flex flex-row justify-between align-end mb-2">
          <h3 className="text-md font-xl font-bold">{collection.title}</h3>
          <p className="text-xs">
            items {items && items.length + collectionProducts.length}
          </p>
        </div>
        <Divider borderWidth="050" borderColor="border-inverse" />
      </div>
      <div
        ref={setNodeRef}
        className="h-3/4 flex flex-col items-start overflow-y-scroll overflow-x-hidden"
      >
        {items && items.length > 0
          ? items.map((product) => (
              <ProductItemCard
                shop={session.shop}
                key={product?.id}
                product={product}
              />
            ))
          : null}
        {collectionProducts.map((product) => (
          <ProductItemCard
            shop={session.shop}
            key={product.id}
            product={product}
          />
        ))}
      </div>
      <Divider borderWidth="050" borderColor="border-secondary" />
      <div className="collection-item-card-error-section flex flex-row items-start mt-2">
        {error ? (
          <InlineError
            message="Error fetching products for collection"
            fieldID="-"
          />
        ) : noProductsError ? (
          <Text as="p" fontWeight="medium">
            No products
          </Text>
        ) : null}
      </div>
    </div>
  );
};

export default CollectionItemCard;
