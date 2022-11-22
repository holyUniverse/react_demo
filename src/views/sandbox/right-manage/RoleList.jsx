import React, { useEffect, useState } from "react";
import { Table, Tree, Button, Modal } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setDataSource] = useState([]);
  const [rights, setRights] = useState([]);
  const [curRights, setCurRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
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
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleEdit(item)}
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
    console.log(item);
    const dataList = JSON.parse(JSON.stringify(dataSource));
    const newList = dataList.filter((data) => data.id !== item.id);
    axios.delete(`/roles/${item.id}`);
    setDataSource(newList);
  };

  const handleEdit = (item) => {
    setCurRights(item.rights);
    setCurrentId(item.id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    const newList = dataSource.map((item) => {
      if (item.id === currentId) {
        return {
          ...item,
          rights: curRights,
        };
      }
      return item;
    });
    //前端同步
    setDataSource(newList);
    //后端同步
    axios.patch(`/roles/${currentId}`, {
      rights: curRights,
    })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    console.log("onCheck", checkedKeys, info);
    setCurRights(checkedKeys);
  };

  useEffect(() => {
    axios.get("/roles").then((res) => {
      console.log(res.data, "roles");
      setDataSource(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      console.log(res.data, "rights");
      setRights(res.data);
    });
  }, []);
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
      <Modal
        title="权限分配"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          checkStrictly
          checkedKeys={curRights}
          onSelect={onSelect}
          onCheck={onCheck}
          treeData={rights}
        />
      </Modal>
    </div>
  );
}
