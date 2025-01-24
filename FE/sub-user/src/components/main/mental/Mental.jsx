import "./Mental.css";

import PageContainer from "../container/PageContainer";

import Keywords from "./Keywords";
import MentalChartContainer from "./MentalChartContainer";
import MentalReport from "./MentalReport";

export default function Mental() {
  const mainUserName = "박순자123";

  return (
    <div id="mental-main">
      <div id="mental-container">
        <div id="mental-elem-left">
          <PageContainer title={`${mainUserName}님의 정신 건강 상태`}>
            <MentalChartContainer />
          </PageContainer>
          <Keywords />
        </div>
        <div id="mental-elem-right">
          <PageContainer title="대화 리포트">
            <MentalReport />
          </PageContainer>
        </div>
      </div>
    </div>
  );
}
