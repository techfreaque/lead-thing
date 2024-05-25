'use client';

import { Button, Table, Text, Title } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { UserType } from '@/app/_context/authentication';
import { invoiceUrl, subscriptionTiers } from '@/app/_lib/constants';
import { getPaidOrders, PaidOrderType } from '@/app/_server/orders';

export default function MyOrders({ user }: { user: UserType }) {
  const [orders, setOrders] = useState<PaidOrderType[]>();
  useEffect(() => {
    getPaidOrders(user.email).then((_orders) => setOrders(_orders));
  }, [user]);
  return orders?.length ? (
    <>
      <Title ta="center" order={2} mt="xl">
        Your orders
      </Title>
      <Table my="xl">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Order Creation Date</Table.Th>
            <Table.Th>Payment Date</Table.Th>
            <Table.Th>Valid Until</Table.Th>
            <Table.Th>Payment Status</Table.Th>
            <Table.Th>Product</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Download Invoice</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders?.map((element) => (
            <Table.Tr key={element.transactionId}>
              <Table.Td>{element.createdAt.toDateString()}</Table.Td>
              <Table.Td>{element.payedAt?.toDateString() || ''}</Table.Td>
              <Table.Td>{element.validUntil?.toDateString() || ''}</Table.Td>
              <Table.Td>{element.paymentStatus}</Table.Td>
              <Table.Td>{subscriptionTiers[element.productId].title}</Table.Td>
              <Table.Td>€{element.amount}</Table.Td>
              {element.paymentStatus === 'paid' && (
                <Table.Td>
                  <Link href={invoiceUrl + element.transactionId}>
                    <Button>Download</Button>
                  </Link>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  ) : (
    <>
      <Title ta="center" order={2} mt="xl" mb="md">
        You don&apos;t have any orders yet :(
      </Title>
      <Text ta="center">
        You can download your invoices here once you&apos;ve completed a purchase
      </Text>
    </>
  );
}
