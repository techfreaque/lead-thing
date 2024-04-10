import React, { Fragment } from 'react';
import { Page, Document, Image, StyleSheet, View, Text } from '@react-pdf/renderer';
import logo from './leadThingLogo.png';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingLeft: 60,
    paddingRight: 60,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  logo: {
    // width: 74,
    height: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

interface invoiceItems {
  qty: number;
  rate: number;
  sno: string;
  desc: string;
}
export interface Invoice {
  invoice_no: string;
  trans_date: string;
  items: invoiceItems[];
  company: string;
  address: string;
  email: string;
}
export default function InvoiceGenerator({ invoice }: { invoice: Invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image style={styles.logo} src={logo.src} />
        <InvoiceTitle title="Invoice" />
        <InvoiceNo invoice={invoice} />
        <BillTo invoice={invoice} />
        <InvoiceItemsTable invoice={invoice} />
        <InvoiceThankYouMsg />
      </Page>
    </Document>
  );
}

const titleStyle = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  reportTitle: {
    color: '#228be6',
    letterSpacing: 4,
    fontSize: 25,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

function InvoiceTitle({ title }: { title: string }) {
  return (
    <View style={titleStyle.titleContainer}>
      <Text style={titleStyle.reportTitle}>{title}</Text>
    </View>
  );
}

const numberStyles = StyleSheet.create({
  invoiceNoContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end',
  },
  invoiceDateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  invoiceDate: {
    fontSize: 12,
    fontStyle: 'bold',
  },
  label: {
    width: 60,
  },
});

function InvoiceNo({ invoice }: { invoice: Invoice }) {
  return (
    <>
      <View style={numberStyles.invoiceNoContainer}>
        <Text style={numberStyles.label}>Invoice No:</Text>
        <Text style={numberStyles.invoiceDate}>{invoice.invoice_no}</Text>
      </View>
      <View style={numberStyles.invoiceDateContainer}>
        <Text style={numberStyles.label}>Date: </Text>
        <Text>{invoice.trans_date}</Text>
      </View>
    </>
  );
}

const clientStyles = StyleSheet.create({
  headerContainer: {
    marginTop: 36,
  },
  billTo: {
    marginTop: 20,
    paddingBottom: 3,
    fontFamily: 'Helvetica-Oblique',
  },
});

function BillTo({ invoice }: { invoice: Invoice }) {
  return (
    <View style={clientStyles.headerContainer}>
      <Text style={clientStyles.billTo}>Bill To:</Text>
      <Text>{invoice.company}</Text>
      <Text>{invoice.address}</Text>
      <Text>{invoice.email}</Text>
    </View>
  );
}

const tableRowsCount = 1;

const tableStyles = StyleSheet.create({
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#228be6',
  },
});

const InvoiceItemsTable = ({ invoice }: { invoice: Invoice }) => (
  <View style={tableStyles.tableContainer}>
    <InvoiceTableHeader />
    <InvoiceTableRow items={invoice.items} />
    <InvoiceTableBlankSpace rowsCount={tableRowsCount - invoice.items.length} />
    <InvoiceTableFooter items={invoice.items} />
  </View>
);

const borderColor = '#90e5fc';
const tHeaderStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomColor: '#228be6',
    backgroundColor: '#228be6',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
  },
  description: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '15%',
  },
});

const InvoiceTableHeader = () => (
  <View style={tHeaderStyles.container}>
    <Text style={tHeaderStyles.description}>Item Description</Text>
    <Text style={tHeaderStyles.qty}>Qty</Text>
    <Text style={tHeaderStyles.rate}>@</Text>
    <Text style={tHeaderStyles.amount}>Amount</Text>
  </View>
);

const tRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#228be6',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
  },
  description: {
    width: '60%',
    textAlign: 'left',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingLeft: 8,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    textAlign: 'right',
    paddingRight: 8,
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

function InvoiceTableRow({ items }: { items: invoiceItems[] }) {
  const rows = items.map((item) => (
    <View style={tRowStyles.row} key={item.sno.toString()}>
      <Text style={tRowStyles.description}>{item.desc}</Text>
      <Text style={tRowStyles.qty}>{item.qty}</Text>
      <Text style={tRowStyles.rate}>$ {item.rate}</Text>
      <Text style={tRowStyles.amount}>$ {(item.qty * item.rate).toFixed(2)}</Text>
    </View>
  ));
  return <>{rows}</>;
}

const tBlanStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#228be6',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontStyle: 'bold',
    color: 'white',
  },
  description: {
    width: '60%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  qty: {
    width: '10%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  rate: {
    width: '15%',
    borderRightColor: borderColor,
    borderRightWidth: 1,
  },
  amount: {
    width: '15%',
  },
});

function InvoiceTableBlankSpace({ rowsCount }: { rowsCount: number }) {
  const blankRows = Array(rowsCount).fill(0);
  const rows = blankRows.map((x, i) => (
    <View style={tBlanStyles.row} key={`BR${i}`}>
      <Text style={tBlanStyles.description}>-</Text>
      <Text style={tBlanStyles.qty}>-</Text>
      <Text style={tBlanStyles.rate}>-</Text>
      <Text style={tBlanStyles.amount}>-</Text>
    </View>
  ));
  return <>{rows}</>;
}

const tFooterStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#228be6',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    fontStyle: 'bold',
  },
  description: {
    width: '85%',
    textAlign: 'right',
    borderRightColor: borderColor,
    borderRightWidth: 1,
    paddingRight: 8,
  },
  total: {
    width: '15%',
    textAlign: 'right',
    paddingRight: 8,
  },
});

function InvoiceTableFooter({ items }: { items: invoiceItems[] }) {
  const total = items
    .map((item) => item.qty * item.rate)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return (
    <View style={tFooterStyles.row}>
      <Text style={tFooterStyles.description}>TOTAL</Text>
      <Text style={tFooterStyles.total}>$ {Number.parseFloat(`${total}`).toFixed(2)}</Text>
    </View>
  );
}

const thanksStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    marginTop: 12,
  },
  reportTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});

const InvoiceThankYouMsg = () => (
  <View style={thanksStyles.titleContainer}>
    <Text style={thanksStyles.reportTitle}>Thank you for your purchase</Text>
  </View>
);
