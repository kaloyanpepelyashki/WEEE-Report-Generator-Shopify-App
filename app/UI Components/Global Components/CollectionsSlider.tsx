import Collection from "~/Models/Collection";
import CollectionItemCard from "../Small Components/CollectionItemCard";
import { Button } from "@shopify/polaris";
import { PlusIcon } from "@shopify/polaris-icons";

type CollectionSliderProps = {
  collections: Array<Collection>;
  sections: Record<string, any> | undefined;
  session: { shop: string; accessToken: string };
  title: string;
  action: () => void;
};

const CollectionsSlider: React.FC<CollectionSliderProps> = ({
  collections,
  sections,
  session,
  title,
  action,
}) => {
  return (
    <div className="collections-slider-wrapper w-full h-full">
      <div className=" collections-slider-top-section w-full flex flex-row justify-between">
        <h4 className="collections-slider-title text-2xl font-bold">{title}</h4>
        <Button onClick={action} icon={PlusIcon}>
          Add Category
        </Button>
      </div>
      <div className="h-full flex flex-row items-start pl-1 pr-4 py-3 mt-5 overflow-x-scroll">
        {/* //The component that displays collectios from vendor's store as droppable card components */}
        {collections.length > 0 ? (
          collections.map((collection) => (
            <CollectionItemCard
              collection={collection}
              items={sections[collection.id]}
              key={collection.id}
              session={session}
            />
          ))
        ) : (
          <h1>No WEEE Categories found</h1>
        )}
      </div>
    </div>
  );
};

export default CollectionsSlider;
