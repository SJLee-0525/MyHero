import "./Activity.css";

import React, { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { HealthContext } from "../../../store/healthStore";

export default class Example extends PureComponent {
  // context를 클래스형 컴포넌트에서 사용
  static contextType = HealthContext;

  render() {
    const healthStore = this.context;

    // 데이터를 합산하여 Recharts가 요구하는 배열 형식으로 변환
    const weeklyData = [
      {
        name: "Health",
        value:
          healthStore.healthLog.reduce((acc, entry) => acc + entry.health, 0) /
          7,
      },
      {
        name: "Mental",
        value:
          healthStore.healthLog.reduce((acc, entry) => acc + entry.mental, 0) /
          7,
      },
    ];

    // 막대 색상 렌더링을 위한 커스텀 함수
    const renderCustomBar = (props) => {
      const { x, y, width, height, value } = props;
      const fillColor = value >= 70 ? "#44803f" : "#ff5a33"; // 초록색 또는 빨간색
      return (
        <rect x={x} y={y} width={width} height={height} fill={fillColor} />
      );
    };

    // 커스텀 툴팁 렌더링 함수
    const CustomTooltip = ({ active, payload, label }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="date">{label}</p>
            <p className="desc">
              Value:{" "}
              <span className={payload[0].value >= 70 ? "health" : "mental"}>
                {payload[0].value.toFixed(2)}
              </span>
            </p>
          </div>
        );
      }
      return null;
    };

    return (
      <div id="activity-chart" style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={weeklyData}
            margin={{
              top: 10,
              right: 20,
              bottom: 15,
              left: 20,
            }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" />
            <Tooltip content={<CustomTooltip />} />
            {/* 커스텀 shape를 사용한 Bar */}
            <Bar dataKey="value" shape={renderCustomBar} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
