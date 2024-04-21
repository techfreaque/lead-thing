'use client';

import { PDFViewer } from '@react-pdf/renderer';
import { useContext, useEffect, useState } from 'react';
import InvoiceGenerator, { Invoice } from '@/app/_components/InvoiceGenerator/InvoiceGenerator';
import { subscriptionTiers } from '@/app/_lib/constants';
import { UserContext, UserContextType } from '@/app/_context/authentication';
import { getOrder } from '@/app/_server/orders';

export default function InvoicePage({ params }: { params: { invoiceId: string; }; }) {
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
          company: `${user.company}`,
          address: `${user.address}, ${user.zipCode}, ${user.country}`,
          email: user.email,
        })
      );
  }, [user]);
  return (
    invoice && (
      <PDFViewer width="1000" height="600" className="app">
        <InvoiceGenerator invoice={invoice} />
      </PDFViewer>
    )
  );
}
