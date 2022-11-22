import React from "react";
import { Avatar, Card, Col, List, Row } from "antd";
import * as ECharts from "echarts";
import axios from "axios";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

export default function Home() {
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));
  const barRef = useRef();

  const [viewList, setViewList] = useState([]);
  const [starList, setStarList] = useState([]);

  const removeRepeat = (array) => {
    let newSet = new Set();
    array.forEach((v) => {
      newSet.add(v);
    });
    return Array.from(newSet);
  };

  const getCategory = (dataSource) => {
    const newList = dataSource.map((item) => item.category.title);
    return removeRepeat(newList);
  };

  const getCategoryNum = (dataSource) => {
    const categoryList = getCategory(dataSource);
    let categoryNumList = [];
    let categoryNum = 0;
    for (const category of categoryList) {
      categoryNum = dataSource.filter(
        (item) => item.category.title === category
      ).length;
      categoryNumList.push(categoryNum);
    }
    return categoryNumList;
  };

  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=10"
      )
      .then((res) => {
        console.log(res.data, "viewList viewList");
        setViewList(res.data);
      });
  }, []);

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      console.log(res.data,getCategory(res.data), getCategoryNum(res.data),"dataSource dataSource");

      // 基于准备好的dom，初始化echarts实例
      var myChart = ECharts.init(barRef.current);

      // 指定图表的配置项和数据
      var option = {
        title: {
          text: "新闻分类图示",
        },
        tooltip: {},
        legend: {
          data: ["数量"],
        },
        xAxis: {
          data: getCategory(res.data),
          axisLabel: {
            rotate: '45',
          }
        },
        yAxis: {
          minInterval: 1,
        },
        series: [
          {
            name: "数量",
            type: "bar",
            data: getCategoryNum(res.data),
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);

      window.onresize = () => {
        myChart.resize()
      }

      return () => {
        window.onresize = null
      }
    });
  }, []);

  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=10"
      )
      .then((res) => {
        console.log(res.data, "viewList viewList");
        setStarList(res.data);
      });
  }, []);

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户浏览最多" bordered>
            <List
              size="small"
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered>
            <List
              size="small"
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <a href={`#/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={username}
              description={
                <div>
                  <b>{region || "全球"}</b>
                  <span style={{ marginLeft: "20px" }}>{roleName}</span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>

      <div
        ref={barRef}
        style={{ width: "100%", height: "400px", marginTop: "30px" }}
      ></div>
    </div>
  );
}
