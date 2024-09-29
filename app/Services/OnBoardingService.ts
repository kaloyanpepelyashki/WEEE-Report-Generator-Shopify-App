import db from "../db.server";

/**
 * This class provides methods for checking or setting onboarding state in the Prisma database
 */
export class OnBoardingService {
  constructor() {}

  /**
   * This method checks, if a record with the shop unique identifier exists in the database, and if yes, will return true
   * @param {string} shop
   * @returns {boolean}
   */
  public async isShopOnBoardingStateValid(shop: string): Promise<boolean> {
    try {
      const shopOnBoardingState = await db.shopOnBoardingSession.findFirst({
        where: { shop },
      });

      return !!shopOnBoardingState;
    } catch (e) {
      console.log("Error retreiving shop onboarding state: ", e);
      throw e;
    }
  }

  /**
   * This method sets a new record in the prisma database, validating the shop has been onboarded. If the action is success, the method returns true, false otherwise
   * @param shop
   * @returns {boolean}
   */
  public async setShopOnBoardingState(shop: string): Promise<boolean> {
    try {
      const result = await db.shopOnBoardingSession.create({
        data: {
          shop: shop,
          isOnBoarded: true,
        },
      });
      return !!result;
    } catch (e) {
      console.log("Error setting shop onboarding state: ", e);
      throw e;
    }
  }
}

const onBoardingService: OnBoardingService = new OnBoardingService();
export default onBoardingService;
