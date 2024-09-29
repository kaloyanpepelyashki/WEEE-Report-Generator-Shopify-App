import { Checkbox, Box, Text } from "@shopify/polaris";
import { useCallback, useState } from "react";
type OnBoardingCheckBoxProps = {
  displayTitle: string;
  title: string;
  description: string;
  handleSelectCollection: (
    title: string,
    description: string,
    checked: boolean,
  ) => void;
};

const OnBoardingCheckBox: React.FC<OnBoardingCheckBoxProps> = ({
  displayTitle,
  title,
  description,
  handleSelectCollection,
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleCheck = useCallback(
    (newChecked: boolean) => {
      setChecked(newChecked);
      console.log(checked);
      handleSelectCollection(title, description, newChecked);
    },
    [checked],
  );

  return (
    <div className="w-full mb-4 flex bg-white py-2 px-4 rounded-md">
      <div className="flex flex-col items-start">
        <Checkbox
          label={<h4 className="font-bold text-md">{displayTitle}</h4>}
          name={title}
          checked={checked}
          onChange={handleCheck}
        />
        <Box paddingBlockStart="100">
          <Text as="p" variant="bodyXs">
            {description}
          </Text>
        </Box>
      </div>
    </div>
  );
};

export default OnBoardingCheckBox;
