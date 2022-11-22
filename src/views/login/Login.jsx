import React from "react";
import { Form, Input, Checkbox, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import "./Login.css";

export default function Login(props) {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    axios
      .get(
        `/users?username=${values.username}&&password=${values.password}&&roleState=true&_expand=role`
      )
      .then((res) => {
        console.log(res.data, "getData");
        if (res.data.length === 0) {
          message.error("用户名或密码不匹配");
        } else {
          localStorage.setItem("token", JSON.stringify(res.data[0]));
          props.history.push("/");
        }
      });
  };

  return (
    <div className="login-box">
      <div className="login-container">
        <div className="login-title">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "请输入用户名!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "请输入密码!",
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              忘记密码
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登录
            </Button>
            Or <a href="">立即注册</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
