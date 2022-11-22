import { Button } from "antd";
import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";

export default function SunSet() {
  const { dataSource, handleSunSet } = usePublish(3);

  return (
    <NewsPublish
      dataSource={dataSource}
      button={(id) => <Button danger onClick={() => handleSunSet(id)}>删除</Button>}
    ></NewsPublish>
  );
}
