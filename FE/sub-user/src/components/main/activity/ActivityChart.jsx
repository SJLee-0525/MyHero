import "./Activity.css";

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
        <p className="health">{`health : ${payload}`}</p>
        {/* <p className="mental">{`mental : ${payload[1].value}`}</p> */}
        <p className="desc">건강함</p>
      </div>
    );
  }

  return null;
}

export default function ActivityChart() {
  const healthStore = useContext(HealthContext);

  let activityStatus =
    healthStore.activityStatus.length > 0
      ? [...healthStore.activityStatus]
      : [];
  if (activityStatus.length > 7) {
    activityStatus = activityStatus.slice(0, 7);
  }
  activityStatus = activityStatus.reverse();

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
          data={activityStatus}
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
            dataKey="score"
            stroke="#44803F"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
