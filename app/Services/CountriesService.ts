import Country from "~/Models/Contry";

class CountriesService {
  private readonly applicationId: string =
    "lCkHAliNPkNlf1fHyMZafaurQQusMeHJNPi2LSo5";
  private readonly apiKey: string = "YDWxyS9d2uvz0SFG39BnDl7tvijdhTpIGl36FN3l";
  constructor() {}

  public async getEuropeanCountries(): Promise<{
    isSuccess: boolean;
    status: number;
    payload: Array<Country>;
    message?: string;
  }> {
    try {
      const response = await fetch(
        "https://parseapi.back4app.com/classes/europeanUnion_list_of_eu_union_countries?limit=38&keys=country,createdAt,objectId",
        {
          headers: {
            "X-Parse-Application-Id": this.applicationId,
            "X-Parse-REST-API-Key": this.apiKey,
          },
        },
      );

      if (response && response.status == 200) {
        const data = await response.json();
        const countryList: Array<Country> = data.results.map(
          (country: any) =>
            new Country(
              country.objectId,
              country.country,
              country.country,
              country.objectId,
            ),
        );

        return {
          isSuccess: true,
          status: response.status,
          payload: countryList,
        };
      }

      return {
        isSuccess: false,
        status: response.status,
        payload: [],
        message: "Failed to fetch countries",
      };
    } catch (e: any) {
      console.log("Error getting european countires: ", e);
      return { isSuccess: false, status: 0, payload: [], message: e.message };
    }
  }
}

export default CountriesService;
