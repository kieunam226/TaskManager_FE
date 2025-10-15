import React from 'react'
import {
    Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const CustomPieChart = ({data, colors}) => {
   console.log("PieChart data:", data);
  console.log("PieChart colors:", colors);
  return ( <div style={{ width: '100%', height: '400px' }}>
    <ResponsiveContainer>
      <PieChart>
          <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={130}
              innerRadius={100}
              labelLine={false}
              label
          >
              {data.map((entry, index) => (
               <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
          </Pie>
      <Tooltip content={<CustomTooltip /> } />
      <Legend content={<CustomLegend /> } />    
      </PieChart>
    </ResponsiveContainer>
   </div>
  
  )
}

export default CustomPieChart