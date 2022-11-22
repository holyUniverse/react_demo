import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Table, Modal, Form, Input } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  const EditableContext = React.createContext(null);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "栏目名称",
      dataIndex: "title",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave,
      }),
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
              onClick={() => handleDelete(item)}
              style={{ marginRight: "5px" }}
            />
          </div>
        );
      },
    },
  ];

  const handleSave = (record) => {
    console.log(record, "record");
    const newList = dataSource.map((item) => {
      if (item.id === record.id) {
        item.title = record.title;
        item.value = record.title;
      }
      return item;
    });
    setDataSource(newList);
    axios.patch(`/categories/${record.id}`, {
        title: record.title,
        value: record.title,
    })
  };
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      console.log(res.data, "roles");
      setDataSource(res.data);
    });
  }, []);

  const handleDelete = (item) => {
    confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      onOk: () => deleteItem(item),
      okText: "确认",
      cancelText: "取消",
    });
  };

  const deleteItem = (item) => {
    const newList = dataSource.filter((data) => data.id !== item.id);
    axios.delete(`/categories/${item.id}`);
    setDataSource(newList);
  };

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        components={components}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
