import "./Mental.css";

import { useContext } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  // CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { HealthContext } from "../../../store/healthStore";

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="date">{label}</p>
        <p className="mental">{`mental : ${payload}`}</p>
        <p className="desc">건강함</p>
      </div>
    );
  }

  return null;
}

export default function ActivityChart() {
  const healthStore = useContext(HealthContext);

  let mentalReport = healthStore.mentalReport
    ? [...healthStore.mentalReport]
    : [];
  if (mentalReport.length > 7) {
    mentalReport = mentalReport.slice(0, 7);
  }
  mentalReport = mentalReport.reverse();

  return (
    <div id="mental-chart">
      <ResponsiveContainer
        width="100%"
        height="100%"
        Style={{ width: 100, backgroundColor: "#ccc" }}
      >
        <LineChart
          width={300}
          height={100}
          data={mentalReport}
          margin={{
            top: 10,
            right: 50,
            bottom: 15,
          }}
        >
          <XAxis dataKey="reported_at" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="average_score"
            stroke="#FF5A33"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
