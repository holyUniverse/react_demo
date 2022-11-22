import React, { useEffect, useState } from "react";
import { Table, notification, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";

import axios from "axios";
const { confirm } = Modal;

export default function NewsDraft(props) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category) => {
        return <div>{category?.title}</div>
      }
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleConfirm(item)}
              style={{ marginRight: "5px" }}
            />
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(item)}
              style={{ marginRight: "5px" }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<UploadOutlined />}
              onClick={() => handleUpload(item)}
            />
          </div>
        );
      },
    },
  ];

  const handleConfirm = (item) => {
    confirm({
        title: "Confirm",
        icon: <ExclamationCircleOutlined />,
        onOk: () => deleteItem(item),
        okText: "确认",
        cancelText: "取消",
      });
  };

  const deleteItem = (item) => {
    const newList = dataSource.filter(data => data.id !== item.id)
    setDataSource(newList)
    axios.delete(`/news/${item.id}`)
  }

  const handleEdit = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  };

  const handleUpload = (item) => {
    axios
    .patch(`/news/${item.id}`, {
      auditState: 1
      // publishTime: 0,
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
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
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
