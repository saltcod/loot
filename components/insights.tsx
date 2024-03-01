import Chart from './Chart'

interface InsightsProps {
  transactions: any
}

const Insights = ({ transactions }: InsightsProps) => {
  return (
    <div className="mt-12 mx-auto bg-background rounded-lg p-4">
      <Chart transactions={transactions} />
    </div>
  )
}

export default Insights
