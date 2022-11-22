import React, { useEffect, useState } from "react";
import { Layout, Spin } from "antd";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import SandBoxRouter from "../../routers/SandBoxRouter";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import "./SandBox.css";
import { useSelector } from "react-redux";

const { Content } = Layout;

export default function SandBox() {
  NProgress.start();
  const { isLoading } = useSelector((state) => state.CommonReducer);

  useEffect(() => {
    NProgress.done();
  });

  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader
        ></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Spin size="large" spinning={isLoading}>
            <SandBoxRouter></SandBoxRouter>
          </Spin>
        </Content>
      </Layout>
    </Layout>
  );
}
