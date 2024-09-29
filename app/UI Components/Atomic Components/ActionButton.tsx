import { Button } from "@shopify/polaris";

type ExportButtonProps = {
  action: () => void;
  heading: string;
  loading?: boolean;
};

const ActionButton: React.FC<ExportButtonProps> = ({
  action,
  heading,
  loading,
}) => {
  return (
    <Button onClick={action} variant="primary" size="large" loading={loading}>
      {heading}
    </Button>
  );
};

export default ActionButton;
