import React, { useState, useEffect, useMemo } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({
    income: 0,
    outcome: 0,
    total: 0,
  } as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get<Response>('/transactions');
      setBalance(data.balance);
      setTransactions(data.transactions);
    }

    loadTransactions();
  }, []);

  const formattedBalance = useMemo(() => {
    return {
      income: formatValue(balance.income),
      outcome: formatValue(balance.outcome),
      total: formatValue(balance.total),
    };
  }, [balance]);

  function toDate(value: Date): string {
    const date = new Date(value);
    return formatDate(date);
  }

  function toCurrencyNumber(value: number, type: string): string {
    return type === 'income' ? formatValue(value) : `- ${formatValue(value)}`;
  }

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{formattedBalance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{formattedBalance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{formattedBalance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  <td className={transaction.type}>
                    {toCurrencyNumber(transaction.value, transaction.type)}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{toDate(transaction.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
