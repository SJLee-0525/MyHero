import "./Mental.css";

import { useContext } from "react";

import { HealthContext } from "../../../store/healthStore";

import Widget from "../../widget/Widget";

export default function KeywordsWidget() {
  const healthStore = useContext(HealthContext);

  const mainUserName = "박순자123";

  return (
    <Widget title={`${mainUserName}님의 대화 키워드`} type="keyword">
      {healthStore.keywords.map((content, index) => {
        return (
          <span
            key={index}
            id="keyword-box"
            style={{
              backgroundColor:
                healthStore.keywordColors[
                  index % healthStore.keywordColors.length
                ][0],
              color:
                healthStore.keywordColors[
                  index % healthStore.keywordColors.length
                ][1],
            }}
          >
            {content}
          </span>
        );
      })}
    </Widget>
  );
}
