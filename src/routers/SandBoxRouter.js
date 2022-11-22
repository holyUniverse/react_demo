import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import axios from "axios";

import Home from "../views/sandbox/home/Home";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NoPermission from "../views/sandbox/nopermission/NoPermission";
import Published from "../views/sandbox/publish-manage/Published";
import SunSet from "../views/sandbox/publish-manage/SunSet";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage/RoleList";
import UserList from "../views/sandbox/user-manage/UserList";
import Audit from "../views/sandbox/audit-manage/Audit";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import NewsPreview from "../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": SunSet,
};

export default function SandBoxRouter() {
  const [backRouterList, setBackRouterList] = useState([]);
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  const checkRouter = (item) => {
    return item.pagepermisson || item.routepermisson;
  };

  const checkUser = (item) => {
    return rights.includes(item.key);
  };

  useEffect(() => {
    Promise.all([
      axios.get("/rights"),
      axios.get("/children"),
    ]).then((res) => {
      const newList = [...res[0].data, ...res[1].data].filter((item) => {
        for (const key in LocalRouterMap) {
          if (Object.hasOwnProperty.call(LocalRouterMap, key)) {
            // const element = LocalRouterMap[key];
            if (key === item.key) {
              return true;
            }
          }
        }
        return false;
      });
      console.log(newList, "newList newList");
      setBackRouterList(newList);
    });
  }, []);
  return (
    <Switch>
      {backRouterList.map((item) => {
        if (checkRouter(item) && checkUser(item)) {
          return (
            <Route
              path={item.key}
              component={LocalRouterMap[item.key]}
              key={item.key}
              exact
            />
          );
        } else {
          return null;
        }
      })}
      {/* <Route path="/home" component={Home} />
      <Route path="/user-manage/list" component={UserList} />
      <Route path="/right-manage/role/list" component={RoleList} />
      <Route path="/right-manage/right/list" component={RightList} /> */}
      <Redirect from="/" to="/home" exact />
      {backRouterList.length > 0 && <Route path="*" component={NoPermission} />}
    </Switch>
  );
}
