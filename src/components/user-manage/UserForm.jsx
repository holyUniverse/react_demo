import React, { useState, forwardRef, useEffect } from "react";
import { Form, Select, Input } from "antd";
const { Option } = Select;

const UserForm = forwardRef((props, ref) => {
  const { regions, roles, isUpdate } = props;
  const [isDisable, setIsDisable] = useState(false);
  const { username, roleId, region } = JSON.parse(
    localStorage.getItem("token")
  );

  const handleChangeRegion = (value) => {
    console.log(value);
  };

  const handleChangeRole = (value) => {
    console.log(value);
    if (value === 1) {
      setIsDisable(true);
      ref.current.setFieldsValue({
        region: "",
      });
    } else {
      setIsDisable(false);
    }
  };

  const checkRegionDisabled = (regionItem) => {
    if (isUpdate) {
      if (roleId === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleId === 1) {
        return false;
      } else {
        return region !== regionItem.value;
      }
    }
  };

  const checkRoleDisabled = (roleItem) => {
    if (isUpdate) {
      if (roleId === 1) {
        return false;
      } else {
        return true;
      }
    } else {
      if (roleId === 1) {
        return false;
      } else {
        return roleItem.id !== 3;
      }
    }
  };

  useEffect(() => {
    console.log(props.updateDisable, "我进来了");
    if (props.updateDisable) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [props.updateDisable]);

  return (
    <Form layout="vertical" ref={ref}>
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisable
            ? []
            : [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ]
        }
      >
        <Select
          disabled={isDisable}
          style={{
            width: "100%",
          }}
          onChange={handleChangeRegion}
        >
          {regions.map((region) => (
            <Option
              key={region.id}
              value={region.value}
              disabled={checkRegionDisabled(region)}
            >
              {region.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Select
          style={{
            width: "100%",
          }}
          onChange={handleChangeRole}
        >
          {roles.map((role) => (
            <Option
              key={role.id}
              value={role.id}
              disabled={checkRoleDisabled(role)}
            >
              {role.roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
});

export default UserForm;
