class ReportService {
  protected serverUrl: string;
  protected accessToken: string;
  protected hostName: string;

  constructor(accessToken: string, hostName: string) {
    this.serverUrl = process.env.API_URL || " ";
    this.accessToken = accessToken;
    this.hostName = hostName;
  }

  /**
   * This method calls the server and requests a report calculation to be initialised.
   * The server will generate the report in the form of a Map<string, number> where the key is collection name and the value is the collections sold items' weight in kilograms
   * @param collectionTitles
   * @param fromDate
   * @param toDate
   * @param targetCountry
   * @returns {isSuccess: boolean; totalWeights: Map<string, number> | null; orderCounts: number | null;}
   */
  public async getReportFor(
    collectionTitles: Array<string>,
    fromDate: string,
    toDate: string,
    targetCountry: string,
  ): Promise<{
    isSuccess: boolean;
    status: number;
    payload: {
      totalWeights: Map<string, number>;
      orderCounts: number;
    };
    message?: string;
  }> {
    try {
      const response = await fetch(`${this.serverUrl}/initCalculation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "access-token": this.accessToken,
          "host-name": this.hostName,
        },
        body: JSON.stringify({
          collectionTitles: collectionTitles,
          fromDate: fromDate,
          toDate: toDate,
          targetCountry: targetCountry,
        }),
      });

      if (response && response.status == 200) {
        const responseData = await response.json();

        return {
          isSuccess: true,
          status: response.status,
          payload: {
            totalWeights: responseData.body.totalWeights,
            orderCounts: responseData.body.orderCounts,
          },
        };
      } else if (response && response.status == 500) {
        return {
          isSuccess: false,
          status: response.status,
          payload: { totalWeights: new Map(), orderCounts: 0 },
          message:
            "Error generating report. Server responded with status 500, Internal server error.",
        };
      }

      return {
        isSuccess: false,
        status: response.status,
        payload: { totalWeights: new Map(), orderCounts: 0 },
        message: "Failed to generate report",
      };
    } catch (e: any) {
      console.error("Error getting report: ", e);
      return {
        isSuccess: false,
        status: 0,
        payload: { totalWeights: new Map(), orderCounts: 0 },
        message: e.message,
      };
    }
  }
}

export default ReportService;
