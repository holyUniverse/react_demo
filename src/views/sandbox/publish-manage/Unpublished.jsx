import { Button } from "antd";
import React from "react";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";

export default function Unpublished() {
  const { dataSource, handleUnPublish } = usePublish(1);

  return (
    <NewsPublish
      dataSource={dataSource}
      button={(id) => <Button type="primary" onClick={() => handleUnPublish(id)}>发布</Button>}
    ></NewsPublish>
  );
}
