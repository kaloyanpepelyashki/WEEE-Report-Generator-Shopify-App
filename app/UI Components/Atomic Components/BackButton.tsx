import { useNavigate } from "@remix-run/react";
import { Button, Icon } from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";

const BackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    // <a
    //   onClick={() => navigate(-1)}
    //   className="flex flex-row hover:cursor-pointer"
    // >
    //   <Icon source={ArrowLeftIcon} />
    // </a>

    <Button
      icon={<Icon source={ArrowLeftIcon} />}
      onClick={() => navigate(-1)}
      variant="tertiary"
    />
  );
};

export default BackButton;
