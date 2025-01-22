import "./Activity.css";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    date: "01-15",
    health: 77,
    mental: 65,
  },
  {
    date: "01-16",
    health: 72,
    mental: 90,
  },
  {
    date: "01-17",
    health: 85,
    mental: 88,
  },
  {
    date: "01-18",
    health: 68,
    mental: 72,
  },
  {
    date: "01-19",
    health: 72,
    mental: 82,
  },
  {
    date: "01-20",
    health: 59,
    mental: 67,
  },
  {
    date: "01-21",
    health: 79,
    mental: 70,
  },
];

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="date">{label}</p>
        <p className="health">{`health : ${payload[0].value}`}</p>
        <p className="mental">{`mental : ${payload[1].value}`}</p>
        <p className="desc">건강함</p>
      </div>
    );
  }

  return null;
}

export default function ActivityChart() {
  return (
    <div id="activity-chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
        Style={{ width: 100, backgroundColor: "#ccc" }}
      >
        <LineChart
          width={300}
          height={100}
          data={data}
          margin={{
            top: 10,
            right: 50,
            bottom: 15,
          }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="health"
            stroke="#44803F"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="mental"
            stroke="#FF5A33"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
