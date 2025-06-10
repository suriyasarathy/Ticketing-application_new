import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const PieChartComponent = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/piechart") // Ensure the API is running
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.data.map(item => ({
          ...item,
          percentage: parseFloat(item.percentage) // Convert string to number
        }));
        setChartData(formattedData);
      })
      .catch((error) => console.error("Error fetching chart data:", error));
  }, []);
  
  return (
    <div>
      <h3>Ticket Status  - {chartData.month || "March"}</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="percentage"
          nameKey="status"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
