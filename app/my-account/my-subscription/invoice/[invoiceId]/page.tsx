'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { useContext, useEffect, useState } from 'react';

import InvoiceGenerator, { Invoice } from '@/app/_components/InvoiceGenerator/InvoiceGenerator';
import { UserContext, UserContextType } from '@/app/_context/authentication';
import { subscriptionTiers } from '@/app/_lib/constants';
import { getOrder } from '@/app/_server/orders';

export default function InvoicePage({ params }: { params: { invoiceId: string } }) {
  const [invoice, setInvoice] = useState<Invoice | undefined>();
  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    user &&
      getOrder({ email: user.email, transactionId: params.invoiceId }).then((order) =>
        setInvoice({
          invoice_no: params.invoiceId,
          trans_date: (order.payedAt || new Date()).toDateString(),
          items: [
            {
              qty: 1,
              rate: order.amount,
              sno: order.productId,
              desc: `${subscriptionTiers[order.productId].title} Subscription`,
            },
          ],
          company: user.company,
          name: user.name,
          vat: user.vat,
          zip: user.zipCode,
          country: user.country,
          address: user.address,
          email: user.email,
        })
      );
  }, [user]);
  return (
    invoice && (
      <PDFViewer width="1000" height="1410" className="app">
        <InvoiceGenerator invoice={invoice} />
      </PDFViewer>
    )
  );
}
