import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Dropdown, Menu, Avatar } from "antd";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCollapsed } from "../../redux/actions/sideMenuAction";
const { Header } = Layout;

const TopHeader = (props) => {
  const dispatch = useDispatch();
  const { isCollapsed } = useSelector((state) => state.SideMenuReducer);
  const {
    role: { roleName },
    username,
  } = JSON.parse(localStorage.getItem("token"));
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: roleName,
        },
        {
          key: "2",
          danger: true,
          label: "退出",
          onClick: () => {
            localStorage.setItem("token", "");
            props.history.replace("/login");
          },
        },
      ]}
    />
  );

  return (
    <Header
      className="site-layout-background"
      style={{
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {React.createElement(
        isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: "trigger",
          onClick: () => dispatch(setCollapsed(!isCollapsed)),
        }
      )}
      <div style={{ float: "right" }}>
        <span style={{ marginRight: "10px" }}>
          欢迎 <b style={{ color: "#1890ff" }}>{username}</b> 回来
        </span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default withRouter(TopHeader);
