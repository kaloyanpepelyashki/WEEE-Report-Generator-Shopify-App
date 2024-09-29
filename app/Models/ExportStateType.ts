type ExportStateType = {
  fromDate: { start: Date | null; end: Date | null };
  toDate: { start: Date | null; end: Date | null };
  targetCountry: string | null;
};

export default ExportStateType;
