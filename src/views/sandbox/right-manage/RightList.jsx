import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Popover, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function RightList() {
  const initDataSource = [];
  const [dataSource, setDataSource] = useState(initDataSource);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      console.log(res.data, "rights");
      setDataSource(filterData(res.data));
    });
  }, []);

  const filterData = (list) => {
    return list.map((item) => {
      if (item.children) {
        if (item.children.length === 0) {
          item.children = "";
        } else {
          item.children = filterData(item.children);
        }
        return item;
      } else {
        return item;
      }
    });
  };

  const handleConfirm = (item) => {
    confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      onOk: () => deleteItem(item),
      okText: "确认",
      cancelText: "取消",
    });
  };

  const filterDelData = (list, item) => {
    if (item.grade === 1) {
      list = list.filter((data) => data.id !== item.id);
      axios.delete(`/rights/${item.id}`);
    } else {
      let fatherItem = list.find((data) => data.id === item.rightId);
      fatherItem.children = fatherItem.children.filter(
        (data) => data.id !== item.id
      );
      axios.delete(`/children/${item.id}`);
    }
    return list;
  };

  const deleteItem = (item) => {
    console.log(item);
    const dataList = JSON.parse(JSON.stringify(dataSource));
    setDataSource(filterDelData(dataList, item));
  };

  const handleSwitch = (item) => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
    setDataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => {
        return <Tag color="orange">{key}</Tag>;
      },
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
            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => handleSwitch(item)}
                  ></Switch>
                </div>
              }
              title="用户配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
                onClick={() => {}}
              />
            </Popover>
          </div>
        );
      },
    },
  ];

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
