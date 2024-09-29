import { Card, Icon, InlineGrid, Text } from "@shopify/polaris";
import { useRef, useState } from "react";
import Product from "~/Models/Product";
import ActionButton from "../Atomic Components/ActionButton";
import ProductItemCard from "../Small Components/ProductItemCard";
import SearchBar from "../Small Components/SearchBar";
import { QuestionCircleIcon } from "@shopify/polaris-icons";

type ItemsSliderProps = {
  title: string;
  storeProducts: Product[];
  shop: string;
  action: { openExportModal: () => void; openInstructionsModal: () => void };
};

const ItemsSlider: React.FC<ItemsSliderProps> = ({
  title,
  storeProducts,
  shop,
  action,
}) => {
  let scrl = useRef(null);
  const [scrollX, setscrollX] = useState(0);
  const [scrollEnd, setScrollEnd] = useState(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [searchResult, setSearchResult] = useState<Array<Product> | undefined>(
    [],
  );

  // const slide = (shift: number) => {
  //   scrl.current.scrollBy({
  //     left: shift,
  //     behavior: "smooth",
  //   });

  //   scrl.current.scrollLeft += shift;
  //   setscrollX(scrollX + shift);
  //   if (
  //     Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
  //     scrl.current.offsetWidth
  //   ) {
  //     setScrollEnd(true);
  //   } else {
  //     setScrollEnd(false);
  //   }
  // };

  // const scrollCheck = () => {
  //   setscrollX(scrl.current.scrollLeft);
  //   if (
  //     Math.floor(scrl.current.scrollWidth - scrl.current.scrollLeft) <=
  //     scrl.current.offsetWidth
  //   ) {
  //     setScrollEnd(true);
  //   } else {
  //     setScrollEnd(false);
  //   }
  // };

  const searchFunction = (userInput: string) => {
    if (userInput.length > 0) {
      setIsSearch(true);
      //Filters the products in the storeProducts array based on userInput, taken from the search bar component
      const result: Product[] | undefined = storeProducts.filter((product) =>
        product.title.toLowerCase().includes(userInput.toLowerCase()),
      );

      setSearchResult(result);
    }
  };

  return (
    <div className="w-full">
      <div className="items-slider-header-section w-full flex flex-row justify-between items-center mb-3 px-8">
        <h4 className="item-title text-2xl font-bold">{title}</h4>
        <div className="h-1/2 flex flex-row items-center">
          <div className="mr-8">
            <SearchBar setState={setIsSearch} searchFunction={searchFunction} />
          </div>
          <a
            className="hover:cursor-pointer mr-3"
            onClick={action.openInstructionsModal}
          >
            <Icon source={QuestionCircleIcon} tone="base" />
          </a>
          <ActionButton heading={"Export"} action={action.openExportModal} />
        </div>
      </div>
      <div className="w-full">
        {/* <div
          // onClick={() => slide(-100)}
          className={`left-arrow-left ${scrollX < 1 ? "is-disabled-hide" : ""}`}
        ></div> */}
        <div
          ref={scrl}
          // onScroll={scrollCheck}
          className="h-full flex flex-row items-start pl-1 pr-4 py-3 mt-5 overflow-x-scroll"
        >
          {/* //Re-renders the slider based on the state of isSearch and if there are search results */}
          {isSearch
            ? searchResult != null
              ? searchResult.map((product) => {
                  return (
                    <ProductItemCard
                      key={product.id}
                      product={product}
                      shop={shop}
                    />
                  );
                })
              : "Nothing found"
            : storeProducts.map((product: Product) => {
                return (
                  <ProductItemCard
                    key={product.id}
                    product={product}
                    shop={shop}
                  />
                );
              })}
        </div>
        {/* <div
          className={`right-arrow-right ${!scrollEnd ? "" : "is-disabled-hide"}`}
          // onClick={() => slide(+100)}
        >
          &gt;
        </div> */}
      </div>
    </div>
  );
};

export default ItemsSlider;
