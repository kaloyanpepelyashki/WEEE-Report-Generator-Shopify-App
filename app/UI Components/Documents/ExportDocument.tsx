import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";

type ExportDocumentProps = {
  shopName: string;
  reportPayload: Map<string, number> | null;
  date: string;
};

const style = StyleSheet.create({
  body: {
    height: "630px",
    width: "420px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  mainSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginTop: "40px",
  },
  dataBox: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "40px",
  },
  bodyText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left",
  },
});
const ExportDocument: React.FC<ExportDocumentProps> = ({
  shopName,
  reportPayload,
  date,
}) => {
  const collections = [
    { name: "WEEE Portable Batteries", value: 12 },
    { name: "WEEE Large IT equipment", value: 23 },
    { name: "WEEE Small equipment smaller than 50cm", value: 31 },
    { name: "WEEE Small IT and telecommunication equipment", value: 7 },
    {
      name: "WEEE - Screens, monitors, and equipment containing screens having a surface greater than 100 cm2",
      value: 50,
    },
  ];

  return (
    <>
      <Document>
        <Page size="A4" style={style.body}>
          <Text style={style.header} fixed>
            ~ WEEE Report for {shopName} ~
          </Text>
          <Text style={style.header} fixed>
            ~ Report date: {date} ~
          </Text>
          <View style={style.mainSection}>
            {reportPayload
              ? Array.from(reportPayload).map(([collection, value]) => {
                  return (
                    <View style={style.dataBox}>
                      <Text style={style.bodyText}>{collection} - </Text>
                      <Text style={style.bodyText}> {value} kg.</Text>
                    </View>
                  );
                })
              : collections.map((collection) => {
                  return (
                    <View style={style.dataBox}>
                      <Text style={style.bodyText}>{collection.name} - </Text>
                      <Text style={style.bodyText}>{collection.value} kg.</Text>
                    </View>
                  );
                })}
          </View>
        </Page>
      </Document>
    </>
  );
};

export default ExportDocument;
