'use client';

import { Button, Table, Title } from '@mantine/core';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { invoiceUrl, subscriptionTiers } from '@/app/constants';
import { UserType } from '@/app/lib/authentication';
import { OrderType, getOrders } from '@/app/lib/orders';

export default function MyOrders({ user }: { user: UserType }) {
  const [orders, setOrders] = useState<OrderType[]>();
  useEffect(() => {
    getOrders(user.email).then((_orders) => setOrders(_orders));
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
            <Table.Th>Payment Status</Table.Th>
            <Table.Th>Product</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th>Download Invoice</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {orders?.map((element) => (
            <Table.Tr key={element.id}>
              <Table.Td>{element.createdAt.toDateString()}</Table.Td>
              <Table.Td>{element.payedAt?.toDateString() || ''}</Table.Td>
              <Table.Td>{element.paymentStatus}</Table.Td>
              <Table.Td>{subscriptionTiers[element.productId].title}</Table.Td>
              <Table.Td>{element.amount}$</Table.Td>
              {element.paymentStatus === 'paid' && (
                <Table.Td>
                  <Link target="blank" href={invoiceUrl + element.id}>
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
    <Title ta="center" order={2}>
      You don't have any orders yet :(
    </Title>
  );
}
