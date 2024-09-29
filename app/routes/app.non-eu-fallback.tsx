import { LoaderFunctionArgs } from "@remix-run/node";
import { Page } from "@shopify/polaris";
import { AlertDiamondIcon } from "@shopify/polaris-icons";
import { authenticate } from "~/shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);

  return null;
};

/**
 *  The user is navigated to this screen, if they are not based in EU or do not own a business based in EU
 */
export default function NonEuFallback() {
  return (
    <Page fullWidth={true}>
      <main className="w-full h-full flex flex-col items-center justify-center pt-64">
        <AlertDiamondIcon width={100} />
        <h1 className="text-2xl font-bold mt-7">We are sorry!</h1>
        <h3 className="text-lg font-medium mt-3">
          This application targets only business based on the terriotory of the
          European Union
        </h3>
      </main>
    </Page>
  );
}
