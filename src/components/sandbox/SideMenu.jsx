import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Menu } from "antd";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "./index.css";
const { Sider } = Layout;
const iconList = {
  "/home": <UploadOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <VideoCameraOutlined />,
  "/right-manage": <UploadOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <VideoCameraOutlined />,
  "/news-manage": <UploadOutlined />,
  "/news-manage/add": <VideoCameraOutlined />,
  "/news-manage/draft": <UserOutlined />,
  "/news-manage/category": <VideoCameraOutlined />,
  "/audit-manage": <UploadOutlined />,
  "/audit-manage/audit": <UserOutlined />,
  "/audit-manage/list": <VideoCameraOutlined />,
  "/publish-manage": <UploadOutlined />,
  "/publish-manage/unpublished": <UserOutlined />,
  "/publish-manage/published": <UploadOutlined />,
  "/publish-manage/sunset": <VideoCameraOutlined />,
};

function SideMenu(props) {
  const [menu, setMenu] = useState([]);
  const { isCollapsed } = useSelector((state) => state.SideMenuReducer);
  const selectKey = [props.location.pathname]
  const openKey = ['/' + props.location.pathname.split('/')[1]]
  const currentUser = JSON.parse(localStorage.getItem('token'))

  const checkPagePermission = (item) => {
    return item.pagepermisson === 1 && currentUser.role.rights.includes(item.key);
  };

  const getItem = (label, key, icon, children, type) => {
    return {
      label,
      key,
      icon,
      children,
      type,
    };
  };

  const clickItem = (item) => {
    console.log(item, props);
    props.history.push(item.key);
  };

  const renderMenu = (menuList) => {
    return menuList?.map((item) => {
      if (checkPagePermission(item)) {
        if (item.children?.length === 0 || !item.children) {
          return getItem(item.title, item.key, iconList[item.key]);
        } else {
          return getItem(
            item.title,
            item.key,
            iconList[item.key],
            renderMenu(item.children)
          );
        }
      } else {
        return false;
      }
    });
  };

  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      console.log(res.data, "getData");
      const menuList = renderMenu(res.data);
      setMenu(menuList);
    });
  }, []);

  // const items = [
  //   getItem("首页", "/home", <UserOutlined />),
  //   getItem("用户管理", "/user-manage", <VideoCameraOutlined />, [
  //     getItem("用户列表", "/user-manage/list"),
  //   ]),
  //   getItem("权限管理", "/right-manage", <UploadOutlined />, [
  //     getItem("角色列表", "/right-manage/role/list"),
  //     getItem("权限列表", "/right-manage/right/list"),
  //   ]),
  // ];
  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div className="sider-box">
        <div className="logo">全球新闻发布管理系统</div>
        <div className="menu-box">
          <Menu
            selectedKeys={selectKey}
            defaultOpenKeys={openKey}
            mode="inline"
            theme="dark"
            inlineCollapsed={isCollapsed}
            items={menu}
            onClick={clickItem}
          />
        </div>
      </div>
    </Sider>
  );
}

export default withRouter(SideMenu);
