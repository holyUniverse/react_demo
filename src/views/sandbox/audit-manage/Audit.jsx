import React, { useEffect, useState } from "react";
import { Button, notification, Table } from "antd";
import axios from "axios";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

export default function Audit(props) {
  const [dataSource, setDataSource] = useState([]);
  const { username, roleId, region } = JSON.parse(
    localStorage.getItem("token")
  );

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
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              disabled={item.default}
              type="primary"
              shape="circle"
              icon={<CheckOutlined />}
              onClick={() => handleCheckOut(item, 1)}
              style={{ marginRight: "5px" }}
            />
            <Button
              disabled={item.default}
              danger
              shape="circle"
              icon={<CloseOutlined />}
              onClick={() => handleCheckOut(item, 0)}
            />
          </div>
        );
      },
    },
  ];

  const handleCheckOut = (item, type) => {
    const newList = dataSource.filter((data) => data.id !== item.id);
    setDataSource(newList);
    axios
      .patch(`/news/${item.id}`, {
        auditState: type ? 2 : 3,
        publishState: type ? 1 : 0,
      })
      .then((res) => {
        props.history.push("/audit-manage/list");
        notification.info({
          message: `通知`,
          description: `您可以到审核列表中去查看新闻`,
          placement: "bottomRight",
        });
      });
  };

  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      console.log(res.data, "getData");
      const newList = res.data;
      setDataSource(
        roleId === 1
          ? newList
          : [
              ...newList.filter(
                (item) =>
                  item.author === username ||
                  (item.region === region && roleId === 2)
              ),
              //   ...newList.filter(
              //     (item) => item.region === region && roleId === 2
              //   ),
            ]
      );
    });
  }, [username, roleId, region]);

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
