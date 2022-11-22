import React, { useEffect, useRef, useState } from "react";
import {
  PageHeader,
  Steps,
  Form,
  Input,
  Button,
  Select,
  message,
  notification,
} from "antd";
import axios from "axios";

import style from "./News.module.css";
import NewsEditor from "../../../components/news-manage/NewsEditor";

const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate(props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({});
  const [content, setContent] = useState("");
  const [newsInfo, setNewsInfo] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem("token"));

  const updateNewsForm = useRef(null);

  const handlePre = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleNext = () => {
    if (currentStep === 0) {
      updateNewsForm.current
        .validateFields()
        .then((value) => {
          console.log(value);
          setFormData(value);
          setCurrentStep(currentStep + 1);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log(formData, content);
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空！");
      } else {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleGetContent = (value) => {
    console.log(value);
    setContent(value);
  };

  const handleSave = (auditState) => {
    axios
      .patch(`/news/${props.match.params.id}`, {
        ...formData,
        content,
        auditState,
        // publishTime: 0,
      })
      .then((res) => {
        props.history.push(
          auditState === 0 ? "/news-manage/draft" : "/audit-manage/list"
        );
        notification.info({
          message: `通知`,
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中去查看新闻`,
          placement: "bottomRight",
        });
      });
  };

  useEffect(() => {
    axios.get("/categories").then((res) => {
      console.log(res.data, "getData");
      setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`/news/${props.match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        console.log(res.data, "getNewsInfo");
        // setNewsInfo(res.data);
        let { title, categoryId, content } = res.data;
        updateNewsForm.current.setFieldsValue({
          title,
          categoryId,
        });
        setContent(content);
      });
  }, [props.match.params.id]);

  return (
    <div>
      <PageHeader
        className="title"
        title="更新新闻"
        subTitle="This is a subtitle"
        onBack={() => props.history.goBack()}
      />
      <Steps current={currentStep}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>
      <div className={currentStep === 0 ? style.step_1_active : style.hidden}>
        <Form
          name="basic"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 22 }}
          ref={updateNewsForm}
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[{ required: true, message: "请输入新闻标题!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[{ required: true, message: "请选择新闻分类!" }]}
          >
            <Select>
              {categories.map((item) => (
                <Option value={item.id} key={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </div>
      <div className={currentStep === 1 ? style.step_2_active : style.hidden}>
        <NewsEditor
          content={content}
          getContent={(value) => handleGetContent(value)}
        ></NewsEditor>
      </div>
      <div style={{ marginTop: "50px" }}>
        {currentStep === 2 && (
          <Button type="primary" onClick={() => handleSave(0)}>
            保存草稿箱
          </Button>
        )}
        {currentStep === 2 && (
          <Button
            danger
            style={{ marginLeft: "10px", marginRight: "10px" }}
            onClick={() => handleSave(1)}
          >
            提交审核
          </Button>
        )}
        {currentStep !== 0 && (
          <Button type="primary" onClick={handlePre}>
            上一步
          </Button>
        )}
        {currentStep !== 2 && (
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={handleNext}
          >
            下一步
          </Button>
        )}
      </div>
    </div>
  );
}
