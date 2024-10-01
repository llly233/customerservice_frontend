import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { IconSemiLogo, IconFeishuLogo, IconHelpCircle, IconBell } from '@douyinfe/semi-icons';
import styles from './index.module.css';
import { AppstoreOutlined, MailOutlined, SettingOutlined, PlusOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Empty, Button, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select, Slider, Switch, TreeSelect, Upload, Modal, message, Space, Badge, Card } from 'antd';
import { NavLink } from "react-router-dom";
import axios from 'axios';
import MissionTable from './table'
import './normalize.css';
import socketIOClient from 'socket.io-client';


type MenuItem = Required<MenuProps>['items'][number];



const Addmission: React.FC<{ form: any }> = ({ form }) => {   // 提交任务表单
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      style={{ maxWidth: 600 }}
    >
      <Form.Item label="Checkbox" name="autoReply" valuePropName="checked">
        <Checkbox>Auto Reply</Checkbox>
      </Form.Item>
      <Form.Item label="Chose Model" name="modal">
        <Radio.Group>
          <Radio value="qianfan"> qianfan </Radio>
          <Radio value="xinghuo"> xinghuo </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Mission Name" name="missionName" rules={[{ required: true, message: 'Please input the mission name!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Custom Q log Link " name="customQLogLink" rules={[{ required: true, message: 'Please input the custom Q log link!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Bot A log Link " name="botALogLink" rules={[{ required: true, message: 'Please input the bot A log link!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Channel" name="channel" rules={[{ required: true, message: 'Please select a channel!' }]}>
        <Select>
          <Select.Option value="WeChat">WeChat</Select.Option>
          <Select.Option value="Taobao">Taobao</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="RAG Dataset" name="ragDataset" rules={[{ required: true, message: 'Please select a RAG dataset!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="RUN" name="run" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};

const ModalOut: React.FC<{ setOpenForm: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setOpenForm }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values: ', values);
      setLoading(true);
      createMission(values);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    setOpen(false);
    setOpenForm(false);
  };

  const createMission = useCallback(async (formValues) => {
    console.log('正在新增任务');
    try {
      const autoReply = String(formValues.autoReply);
      const missionName = String(formValues.missionName);
      const customComplaim = String(formValues.customQLogLink);
      const botReply = String(formValues.botALogLink);
      const watchChannel = String(formValues.channel);
      const chooseRagDataSet = String(formValues.ragDataset);
      const run = String(formValues.run);
      const modal = String(formValues.modal);
      const response = await axios.post(
        'http://127.0.0.1:5000/addAiMission',
        JSON.stringify({ autoReply, missionName, customComplaim, botReply, watchChannel, chooseRagDataSet, run, modal }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        messageApi.success('Mission added successfully');
      } else {
        messageApi.error('Failed to add mission');
      }
      setLoading(false);
      setOpen(false);
      setOpenForm(false);
    } catch (error) {
      messageApi.error('Error adding mission');
      setLoading(false);
    }
  }, [messageApi, setOpen, setOpenForm]);

  return (
    <>
      {contextHolder}
      <Modal
        open={open}
        title="Title"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        <Addmission form={form} />
      </Modal>
    </>
  );
};

const MissionList: React.FC<{ isOpenForm: boolean; setOpenForm: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isOpenForm, setOpenForm }) => {
  return (
    <Empty
      image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
      imageStyle={{ height: 60 }}
      description={
        <span>
           <p>Empty</p>
        </span>
      }
    >
      {isOpenForm ? <ModalOut setOpenForm={setOpenForm} /> : <Button type="primary" onClick={() => setOpenForm(true)}>Create Now</Button>}
    </Empty>
  );
}


const ShowMissonTable = ({ getAiConfig, missionInfo }) => {
  const [missionTable, setMissionTable] = useState([]);
  const [isOpenForm, setOpenForm] = useState(false);


  useEffect(() => {
    getAiConfig();
  }, [getAiConfig]);

  useEffect(() => {
    const missonInfo2 = missionInfo.data
    console.log(missonInfo2)
    if (missonInfo2) { setMissionTable(missonInfo2.result.ai助手配置) }
  }, [missionInfo]);

  return (
    <div>
      <Button onClick={() => setOpenForm(true)}>Add Mission</Button>
      {isOpenForm ? <ModalOut setOpenForm={setOpenForm} /> : null}
      {missionTable != null || missionTable != undefined ? <MissionTable missionTable={missionTable} /> : <MissionList isOpenForm={isOpenForm} setOpenForm={setOpenForm} />}
    </div>
  );
};

const ShowQandA = ({ clickQUrl, clickAUrl }) => {
  const ENDPOINT = "http://127.0.0.1:5000";
  const [message, setMessage] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('message', data => {
      setMessage(data.data);
    });

    socket.on('question', data => {
      setQuestion(data.data);
    });

    socket.on('answer', data => {
      setAnswer(data.data);
    });

    return () => socket.disconnect();
  }, []);
  return (
    <div className="container2">
      <div className="container3">
        <div className="container4">
          <Badge.Ribbon text="Questions" color="cyan">
            <Card style={{ width: "600px", height: "120px" }} title="Customer Query" size="big">
              {question != "" ? question : message}
            </Card>
          </Badge.Ribbon>
        </div>
        <iframe className="modalOverlay2" src={clickQUrl}></iframe>
      </div>
      <div className="container3">
        <div className="container4">
          <Badge.Ribbon text="Reply" color="green">
            <Card style={{ width: "600px", height: "120px" }} title="Bot Answer" size="big">
              {answer != "" ? answer : "ai回答中"}
            </Card>
          </Badge.Ribbon>
        </div>
        <iframe className="modalOverlay2" src={clickAUrl}></iframe>
      </div>
    </div>


  )
}

const Aiconfig = () => {
  const [current, setCurrent] = useState('mail');
  const [missionInfo, setMissionInfo] = useState([]);
  const [clickQUrl, setClickQUrl] = useState("")
  const [clickAUrl, setClickAUrl] = useState("")
  const [isShowIframe, setIsShowIframe] = useState(false)

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const getAiConfig = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/aiConfig", {
        responseType: 'json'
      });
      console.log("response.data", response.data)
      setMissionInfo(response.data);
      console.log("这个是", response.data.data.result.ai助手配置);
    } catch (error) {
      console.error('Error fetching aiconfig:', error);
    }
  }, [missionInfo]);

  let items = [];

  if (missionInfo && missionInfo.data) {
    try {
    const AILog = [{
      label: 'AILog',
      key: `SubMenu-Q`,
      icon: <AppstoreOutlined />,
      children: [
        {
          type: 'group',
          label: 'Tasks',
          children: missionInfo.data.result.ai助手配置.map((item, index) => ({
            label: (<span onClick={() => { setClickQUrl(item.客诉写入表[0].address); setClickAUrl(item.客诉回复表[0].address); setIsShowIframe(true) }}>{item.任务名称} Complain Records</span>),
            key: `${index}-complainRecords`
          }))
        }
      ]
    }];

    // const roboA = [{
    //   label: 'Bot A',
    //   key: `SubMenu-A`,
    //   icon: <AppstoreOutlined />,
    //   children: [
    //     {
    //       type: 'group',
    //       label: 'Tasks',
    //       children: missionInfo.data.result.ai助手配置.map((item, index) => ({
    //         label: (<span onClick={() => { setClickAUrl(item.客诉回复表[0].address); setClickQUrl(item.客诉写入表[0].address); setIsShowIframe(true) }}>{item.任务名称} Replay Record</span>),
    //         key: `${index}-replayRecord`
    //       }))
    //     }
    //   ]
    // }];

    items = [
      {
        label: (
          <NavLink to="/Home">
            Back
          </NavLink>
        ),
        key: 'mail',
        icon: <SettingOutlined />,
      },
      {
        label: (<span onClick={() => { setIsShowIframe(false) }}>Mission</span>),
        key: 'Mission',
        icon: <AppstoreOutlined />,
      },
      ...AILog,
    ];
    }catch (error) {
        console.error('Error fetching aiconfig:', error);
      }
  }




  return (
    <>
      <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} ></Menu>
      <div style={{ height: "50px" }}></div>
      {isShowIframe != true ? <ShowMissonTable getAiConfig={getAiConfig} missionInfo={missionInfo} /> : <ShowQandA clickQUrl={clickQUrl} clickAUrl={clickAUrl} />}
    </>
  );
};

export default Aiconfig;
