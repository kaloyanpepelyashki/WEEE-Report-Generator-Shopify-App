import { DatePicker } from "@shopify/polaris";
import { useCallback, useState } from "react";
import ExportStateType from "~/Models/ExportStateType";

type DatePickerComponentType = {
  label: string;
  purpose: "From" | "To";
  setDate: React.Dispatch<React.SetStateAction<ExportStateType>>;
  selectedDate: { from: Date | null; to: Date | null };
};

const DatePickerComponent: React.FC<DatePickerComponentType> = ({
  label,
  purpose,
  setDate,
  selectedDate,
}) => {
  const dateObj = new Date();
  const [{ month, year }, setCurrentDate] = useState({
    month: dateObj.getMonth(),
    year: dateObj.getFullYear(),
  });
  const handleMonthChange = useCallback(
    (month: number, year: number) => setCurrentDate({ month, year }),
    [],
  );

  return (
    <div className="date-picker-wrapper flex flex-col items-start">
      <h4 className="text-xl font-bold">{label}</h4>
      <DatePicker
        onChange={
          purpose == "From"
            ? (e) =>
                setDate((prevState) => ({
                  ...prevState,
                  fromDate: { start: e.start, end: e.end },
                }))
            : (e) =>
                setDate((prevState) => ({
                  ...prevState,
                  toDate: { start: e.start, end: e.end },
                }))
        }
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        selected={selectedDate.from != null ? selectedDate.from : undefined}
      />
    </div>
  );
};

export default DatePickerComponent;
