import { Button } from "@shopify/polaris";

type CancelButtonProps = {
  action: () => void;
};

const CancelButton: React.FC<CancelButtonProps> = ({ action }) => {
  return <Button onClick={action}>Cancel</Button>;
};

export default CancelButton;
