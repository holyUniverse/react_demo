import React, { useEffect, useState } from "react";
import { Table, notification, Button, Modal, Tag } from "antd";

import axios from "axios";

export default function AuditList(props) {
  const [dataSource, setDataSource] = useState();
  const { username } = JSON.parse(localStorage.getItem("token"));
  const auditList = ["", "审核中", "已通过", "未通过"];
  const colorList = ["", "orange", "green", "red"];
  const actionList = ["", "撤销", "发布", "修改"];

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <div>{category?.title}</div>;
      },
    },
    {
      title: "审核状态",
      dataIndex: "auditState",
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button type="primary" onClick={() => handlePublish(item)}>
              {actionList[item.auditState]}
            </Button>
          </div>
        );
      },
    },
  ];

  const handlePublish = (item) => {
    if (item.auditState === 1) {
      const newList = dataSource.filter((data) => data.id !== item.id);
      setDataSource(newList);
      axios
        .patch(`/news/${item.id}`, {
          auditState: 0,
        })
        .then((res) => {
          notification.info({
            message: `通知`,
            description: `您可以到草稿箱中去查看新闻`,
            placement: "bottomRight",
          });
        });
    } else if (item.auditState === 3) {
      props.history.push(`/news-manage/update/${item.id}`);
    } else {
      axios
        .patch(`/news/${item.id}`, {
          publishState: 2,
          publishTime: Date.now()
        })
        .then((res) => {
          props.history.push(`/publish-manage/published`);

          notification.info({
            message: `通知`,
            description: `您可以到已发布中去查看新闻`,
            placement: "bottomRight",
          });
        });
    }
  };

  useEffect(() => {
    axios
      .get(
        `/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`
      )
      .then((res) => {
        console.log(res.data, "getData");
        setDataSource(res.data);
      });
  }, [username]);

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
