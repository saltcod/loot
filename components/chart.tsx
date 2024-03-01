'use client'
import { TransactionType } from '@/types/types'
import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts'

interface ChartProps {
  transactions: TransactionType[]
}

const processData = (transactions: TransactionType[]) => {
  const dataByMonth: Record<string, { name: string; totalAmount: number }> = {}

  // Initialize dataByMonth with all months
  const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  monthOrder.forEach((month) => {
    dataByMonth[month] = {
      name: month,
      totalAmount: 0,
    }
  })

  // Iterate through the transactions and update totalAmount for each month
  transactions.forEach((transaction) => {
    const date = transaction.date
    const amount = transaction.amount
    const month = new Date(date).toLocaleString('en-US', { month: 'short' })

    if (dataByMonth[month]) {
      dataByMonth[month].totalAmount += amount
    }
  })

  // Calculate the average for all 12 months
  const totalAmounts = monthOrder.map((month) => dataByMonth[month].totalAmount)
  const average = totalAmounts.reduce((sum, amount) => sum + amount, 0) / monthOrder.length

  // Sort the months in chronological order
  const processedData = monthOrder.map((month) => dataByMonth[month])

  return { data: processedData, average }
}

const Chart = ({ transactions }: ChartProps) => {
  const { data, average } = processData(transactions)

  return (
    <>
      <LineChart width={800} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="totalAmount" stroke="blue" label="Total" />
        <Line type="monotone" dataKey="average" stroke="blue" strokeWidth={5} dot={true} />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip label={'Total'} />
        {/* <ReferenceLine y={average} stroke="red" strokeDasharray="3 3" label={`Avg. ${average}`} /> */}
        <ReferenceLine isFront y={average} stroke="blue" strokeDasharray="3 3" label={`$${average.toFixed(2)}`} />
      </LineChart>
    </>
  )
}

export default Chart
