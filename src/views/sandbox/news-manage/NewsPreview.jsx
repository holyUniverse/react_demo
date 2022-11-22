import React, { useEffect, useState } from "react";
import { Button, Descriptions, PageHeader, Row, Statistic, Tag } from "antd";
import axios from "axios";
import moment from "moment";

export default function NewsPreview(props) {
  const [dataSource, setDataSource] = useState(null);
  const auditList = ["未审核", "审核中", "已通过", "未通过"];
  const publishList = ["未发布", "待发布", "已上线", "已下线"];
  const colorList = ["black", "orange", "green", "red"];

  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        console.log(res.data, "getData");
        setDataSource(res.data);
      });
  }, [props.match.params.id]);
  return (
    <div>
      {dataSource && (
        <div>
          <PageHeader
            className="site-page-header"
            onBack={() => window.history.back()}
            title={dataSource.title}
            subTitle={dataSource.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {dataSource.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(dataSource.createTime).format("YYYY/MM/DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {dataSource.publishTime
                  ? moment(dataSource.publishTime).format("YYYY/MM/DD HH:mm:ss")
                  : "---"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {dataSource.region}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colorList[dataSource.auditState] }}>
                  {auditList[dataSource.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: colorList[dataSource.publishState] }}>
                  {publishList[dataSource.publishState] || "---"}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {dataSource.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {dataSource.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">
                {dataSource.comment || "0"}
              </Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            dangerouslySetInnerHTML={{ __html: dataSource.content }}
            style={{ border: "1px solid gray", margin: "0 24px" }}
          ></div>
        </div>
      )}
    </div>
  );
}
