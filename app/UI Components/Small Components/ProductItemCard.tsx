import { useDraggable } from "@dnd-kit/core";
import { InlineGrid, Text } from "@shopify/polaris";
import { LinkIcon } from "@shopify/polaris-icons";
import Product from "~/Models/Product";

type ProductItemCardProps = {
  product: Product;
  shop: string;
};

const ProductItemCard: React.FC<ProductItemCardProps> = ({ product, shop }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: product.id,
  });

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        position: "absolute",
        cursor: "grabbing",
      }
    : {};

  const navigate = (event: React.MouseEvent) => {
    event.stopPropagation();
    const shopStringTrimed = shop.replace(new RegExp(/\.myshopify\.com/), "");
    window.open(
      `https://admin.shopify.com/store/${shopStringTrimed}/products/${product.id}`,
      "_blank",
    );
  };
  return (
    <div
      ref={setNodeRef}
      className="product-item-card-wrapper h-48 w-96 flex flex-col items-center bg-primary rounded-md mr-4 px-3 pt-2 z-10"
      key={product.id}
      style={style}
    >
      <div
        onClick={navigate}
        className="h-1/4 self-end z-50 hover:cursor-pointer"
        style={{ zIndex: 1000 }}
      >
        <LinkIcon width={24} />
      </div>
      <div className="py-2 hover:cursor-grab" {...listeners} {...attributes}>
        <img
          className="h-1/4 self-center"
          src={product.imageUrl}
          alt="Product"
        />
        <InlineGrid gap="300" columns={["twoThirds", "oneThird"]}>
          <Text as="h4" variant="headingMd">
            {product.title}
          </Text>

          <Text as="p" variant="bodyLg">
            {product.weight}g.
          </Text>
        </InlineGrid>
      </div>
    </div>
  );
};

export default ProductItemCard;
