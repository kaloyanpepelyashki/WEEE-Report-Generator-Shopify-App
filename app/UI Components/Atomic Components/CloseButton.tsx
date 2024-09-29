import { Button } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";

type CloseButtonProps = {
  action: () => void;
};

const CloseButton: React.FC<CloseButtonProps> = ({ action }) => {
  return (
    <>
      <Button
        icon={<XIcon width={"30"} />}
        onClick={action}
        variant="tertiary"
      />
    </>
  );
};

export default CloseButton;
