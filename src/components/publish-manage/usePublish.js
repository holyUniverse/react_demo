import { notification } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export default function usePublish(type) {
  const [dataSource, setDataSource] = useState([]);
  const { username } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then((res) => {
        console.log(res.data, "getData");
        setDataSource(res.data);
      });
  }, [username, type]);

  const handlePublish = (id) => {
    console.log(id);
    const newList = dataSource.filter((item) => item.id !== id);
    setDataSource(newList);
    axios
      .patch(`/news/${id}`, {
        publishState: 3,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到已下线中去查看新闻`,
          placement: "bottomRight",
        });
      });
  };

  const handleUnPublish = (id) => {
    console.log(id);
    const newList = dataSource.filter((item) => item.id !== id);
    setDataSource(newList);
    axios
      .patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到已发布中去查看新闻`,
          placement: "bottomRight",
        });
      });
  };

  const handleSunSet = (id) => {
    console.log(id);
    const newList = dataSource.filter((item) => item.id !== id);
    setDataSource(newList);
    axios.delete(`/news/${id}`);
    notification.info({
        message: `通知`,
        description: `您已删除该新闻`,
        placement: "bottomRight",
      });
  };

  return {
    dataSource,
    handlePublish,
    handleUnPublish,
    handleSunSet,
  };
}
