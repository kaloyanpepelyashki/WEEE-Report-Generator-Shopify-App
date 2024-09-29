import { TextField } from "@shopify/polaris";
import { useState } from "react";
type SearchBarProps = {
  //Optional variable, updates search state, if needed
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
  searchFunction: (userInput: any) => void;
};
const SearchBar: React.FC<SearchBarProps> = ({ searchFunction, setState }) => {
  const style = {
    marginRight: "-24px",
  };

  const [value, setValue] = useState<string>("");

  return (
    <>
      <div className="flex flex-row items-center">
        <TextField
          label={null}
          placeholder="Search"
          onChange={(e) => {
            searchFunction(e);
            setValue(e);
          }}
          // onFocus={setState ? () => setState(true) : () => {}}
          onBlur={setState ? () => setState(false) : () => {}}
          autoComplete="off"
          value={value}
        />
      </div>
    </>
  );
};

export default SearchBar;
