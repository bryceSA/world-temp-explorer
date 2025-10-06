import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartData {
  date: string;
  [key: string]: number | string;
}

interface TemperatureChartProps {
  data: ChartData[];
  cities: string[];
}

const TemperatureChart = ({ data, cities }: TemperatureChartProps) => {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--accent))",
    "hsl(38, 92%, 50%)",
    "hsl(220, 89%, 60%)",
    "hsl(280, 60%, 55%)",
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '0.875rem' }}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          style={{ fontSize: '0.875rem' }}
          label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '0.5rem',
          }}
        />
        <Legend />
        {cities.map((city, index) => (
          <Line
            key={city}
            type="monotone"
            dataKey={city}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemperatureChart;
