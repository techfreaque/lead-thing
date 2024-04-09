'use client';
import { UserType } from '@/app/lib/authentication';
import { OrderType, getOrders } from '@/app/lib/orders';
import { Table, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function MyOrders({ user }: { user: UserType }) {
  const [orders, setOrders] = useState<OrderType[]>();
  useEffect(() => {
    getOrders(user.email).then((_orders) => setOrders(_orders));
  }, [user]);
  return Boolean(orders?.length) ? (
    <Table>
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
            <Table.Td>{element.productId}</Table.Td>
            <Table.Td>{element.amount}$</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  ) : (
    <Title order={2}>{"You don't have any orders yet :("}</Title>
  );
}
