import React, { useEffect, useRef, useState } from "react";
import { Table, Button, Modal, Switch, message } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../../components/user-manage/UserForm";

const { confirm } = Modal;

export default function UserList() {
  const addForm = useRef(null);
  const updateForm = useRef(null);
  const initDataSource = [];
  const [dataSource, setDataSource] = useState(initDataSource);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isUpdateVisible, setIsUpdateVisible] = useState(false);
  const [updateDisable, setUpdateDisable] = useState(false);
  const [regions, setRegions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const { username, roleId, region } = JSON.parse(
    localStorage.getItem("token")
  );

  const handleConfirm = (item) => {
    if (item.username === username) {
      message.error("不能删除当前用户");
      return;
    }
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
    const newList = dataSource.filter((data) => data.id !== item.id);
    setDataSource(newList);
    axios.delete(`/users/${item.id}`);
  };

  const handleEdit = (item) => {
    console.log(item);
    setCurrentUser(item);
    if (item.roleId === 1) {
      setUpdateDisable(true);
    } else {
      setUpdateDisable(false);
    }
    setTimeout(() => {
      setIsUpdateVisible(true);
      updateForm.current.setFieldsValue(item);
    }, 0);
  };

  const handleSwitch = (item) => {
    const newList = dataSource.map((data) => {
      if (data.id === item.id) {
        data.roleState = !item.roleState;
        //后端同步
        axios.patch(`/users/${item.id}`, {
          roleState: data.roleState,
        });
        return data;
      }
      return data;
    });
    //前端同步
    setDataSource(newList);
  };

  const handleAddOk = () => {
    addForm.current
      .validateFields()
      .then((value) => {
        console.log(value);
        //新增用户先同步后端生成对应id，方便后续删除以及编辑操作
        axios
          .post("/users", {
            ...value,
            roleState: true,
            default: false,
          })
          .then((res) => {
            setIsAddVisible(false);

            addForm.current.resetFields();

            setDataSource([
              ...dataSource,
              {
                ...res.data,
                role: roles.find((role) => role.id === value.roleId),
              },
            ]);
            console.log(dataSource);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateOk = () => {
    updateForm.current
      .validateFields()
      .then((value) => {
        console.log(value);
        setIsUpdateVisible(false);
        setDataSource(
          dataSource.map((data) => {
            if (data.id === currentUser.id) {
              return {
                ...data,
                ...value,
                role: roles.find((role) => role.id === value.roleId),
              };
            }
            return data;
          })
        );
        setUpdateDisable(!updateDisable);
        axios
          .patch(`/users/${currentUser.id}`, {
            ...value,
          })
          .then((res) => {
            console.log(res.data);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const filterUserList = (list) => {
    console.log(roleId, list, "filterUserList");
    switch (roleId) {
      case 1:
        return list;
      case 2:
        return [
          ...list.filter(
            (item) =>
              item.username === username ||
              (item.region === region && item.roleId === 3)
          ),
        ];
      case 3:
        return [...list.filter((item) => item.username === username)];

      default:
        break;
    }
  };

  useEffect(() => {
    axios.get("/users?_expand=role").then((res) => {
      console.log(res.data, "users");
      setDataSource(filterUserList(res.data));
    });
  }, []);

  useEffect(() => {
    axios.get("/regions").then((res) => {
      console.log(res.data, "regions");
      setRegions(res.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/roles").then((res) => {
      console.log(res.data, "roles");
      setRoles(res.data);
    });
  }, []);

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regions.map((item) => {
          return {
            text: item.title,
            value: item.value,
          };
        }),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, item) => {
        if (value === "全球") {
          return item.region === "";
        }
        return item.region === value;
      },
      render: (region) => {
        return <b>{region ? region : "全球"}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      render: (item) => (
        <Switch
          disabled={item.default}
          checked={item.roleState}
          onChange={() => handleSwitch(item)}
        ></Switch>
      ),
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              disabled={item.default}
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => handleConfirm(item)}
              style={{ marginRight: "5px" }}
            />
            <Button
              disabled={item.default}
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
  return (
    <div>
      <Button
        type="primary"
        style={{ marginBottom: "10px" }}
        onClick={() => setIsAddVisible(true)}
      >
        添加用户
      </Button>
      <Table
        rowKey={(item) => item.id}
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        visible={isAddVisible}
        title="创建用户"
        okText="确认"
        cancelText="取消"
        onCancel={() => setIsAddVisible(false)}
        onOk={handleAddOk}
      >
        <UserForm ref={addForm} regions={regions} roles={roles} />
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          setIsUpdateVisible(false);
          setUpdateDisable(!updateDisable);
        }}
        onOk={handleUpdateOk}
      >
        <UserForm
          ref={updateForm}
          regions={regions}
          roles={roles}
          updateDisable={updateDisable}
          currentUser={currentUser}
          isUpdate={true}
        />
      </Modal>
    </div>
  );
}
