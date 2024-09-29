import { Select } from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import Country from "~/Models/Contry";
import ExportStateType from "~/Models/ExportStateType";
import CountriesService from "~/Services/CountriesService";

type CountryListSelectorProps = {
  label: string;
  // onChangeAction: (value: string) => any;
  setExportState: React.Dispatch<React.SetStateAction<ExportStateType>>;
  exportState: ExportStateType;
};
const CountryListSelector: React.FC<CountryListSelectorProps> = ({
  label,
  setExportState,
  exportState,
}) => {
  const [countries, setCountries] = useState<Array<Country>>([]);
  const [errorState, setErrorState] = useState<boolean>(false);

  useEffect(() => {
    /** Fetches european country.
     * Uses the CountryService class, which is the entry point to the "back4app-eu countries list" API
     */
    async function fetchCountries() {
      try {
        const countriesService = new CountriesService();

        const countries: {
          isSuccess: boolean;
          status: number;
          payload: Array<Country>;
          message?: string;
        } = await countriesService.getEuropeanCountries();

        if (countries.isSuccess && countries.payload.length > 0) {
          return setCountries(countries.payload);
        }
      } catch (e) {
        console.log("Error populating countires picker: ", e);
        setErrorState(true);
      }
    }

    fetchCountries();
  }, []);

  //This function handles the onClick event.
  const handleCountrySelection = useCallback(
    //Sets the targetCountry from the exportState to equal the passed through value
    (value: string) =>
      setExportState((prevState) => ({ ...prevState, targetCountry: value })),
    [],
  );

  return (
    <>
      <Select
        label={
          <h4 className="contries-list-selector-label text-xl font-bold">
            {label}
          </h4>
        }
        onChange={handleCountrySelection}
        options={countries.length > 0 && !errorState ? countries : [""]}
        placeholder={
          exportState.targetCountry && !errorState
            ? exportState.targetCountry.charAt(0).toUpperCase() +
              exportState.targetCountry.slice(1)
            : errorState
              ? "Error"
              : ""
        }
      />
    </>
  );
};

export default CountryListSelector;
