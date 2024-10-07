import React, { useMemo, useState ,useEffect} from 'react';
import { Space, Table, Switch,Select } from 'antd';
import type { TableProps } from 'antd';
import axios from 'axios';
import { Toast } from '@douyinfe/semi-ui';

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[]; //未用到
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Mission Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Created Time',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: 'Watch Channel',
    dataIndex: 'channel',
    key: 'channel',
  },
  {
    title: 'AI Modal',
    dataIndex: 'modal',
    key: 'modal',
  },
  {
    title: 'RAG Dataset',
    render: () => (
      <SelectDB/>
    ),
  },
  {
    title: 'Customer Complain Record',
    dataIndex: 'complain',
    key: 'complain',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Bot Reply Record',
    dataIndex: 'reply',
    key: 'reply',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Auto Reply',
    dataIndex: 'auto_reply',
    key: 'auto_reply',
  },
  {
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        {/* {record.run === 'true' ? "open" : "pause"} */}
        <RunSwitch initStatus={record.run == "true"? Boolean(true):Boolean(false) } missionName={record.name}/> {/** 加入任务开关按钮 */}
        <a onClick={() =>{deleteAiConfig({ Name: record.name })} }>Delete</a>
      </Space>
    ),
  },
];
const deleteAiConfig = async ({ Name }) => {   //删除Ai配置
  console.log('正在删除项目', Name);
  try {
    const missionName = String(Name); 
    const response = await axios.post(
      'http://127.0.0.1:5000/deleteaiconfig',
      { missionName },
      {
        headers: {
          'Content-Type': 'application/json; charset=utf-8' // 指定请求头的 Content-Type 和字符集为 UTF-8
        }
      }
    );
    console.log(response.data);
    if (response.status === 200) {
      Toast.success({ content: 'delete success', duration: 3, theme: 'light' });  //保存成功进行提示
    }
  } catch (error) {
    console.error('failed:', error);
    Toast.error({ content: 'delete error', duration: 3, theme: 'light' });
  }
}



const MissionTable: React.FC = ({ missionTable }) => {
  const data = useMemo(() => {
    return missionTable.map((item, index) => ({
      key: `${index + 1}`,
      name: item.任务名称,
      time: item.创建时间,
      channel: item.监控渠道,
      modal: item.选择模型,
      rag: item.选择商品知识库,
      complain: item.客诉写入表[0].address,
      reply: item.客诉回复表[0].address,
      auto_reply: item.是否自动回复,
      run: item.是否开启
    }));
  }, [missionTable]);



  return <Table columns={columns} dataSource={data} />;
};

/**
 * 机器人开关的按钮
 * @param initStatus-用来界定一开始传进来的值
 * @returns 
 */

const RunSwitch = ({ initStatus, missionName }) => {
  const [checked, setChecked] = useState(false); // 默认初始值为 false

  useEffect(() => {
    // 当 initStatus 改变时，更新 checked 状态
    if (typeof initStatus !== 'undefined') {
      setChecked(initStatus); // 确保转换为布尔值
    }
  }, [initStatus]); // 依赖列表，只有 initStatus 改变时才执行

  const onChange = async (newChecked) => {
    setChecked(newChecked);
    console.log('正在变更项目运行状态', newChecked);

    try {
      const missionNameStr = String(missionName);
      const runStatusStr = String(newChecked);
      const response = await axios.post(
        'http://127.0.0.1:5000/changeMissionIsRun', 
        { missionName: missionNameStr, runStatus: runStatusStr },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
      const response_bot = await axios.post(
        'http://127.0.0.1:5000/operate_bot', 
        { missionName: missionNameStr, runStatus: runStatusStr },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({
          content: `${runStatusStr === "true" ? "正在启动" : "正在关闭"} ${missionNameStr} 任务`,
          duration: 3,
          theme: 'light'
        });
      }
      if(response_bot ===200){
        Toast.success({
          content: `${runStatusStr === "true" ? "正在启动" : "正在关闭"} ${missionNameStr} 机器人`,
          duration: 5,
          theme: 'light'
        });
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: '状态变更失败,请联系管理员', duration: 3, theme: 'light' });
    }

  

  };

  return (
    <Switch
      checkedChildren="开启"
      unCheckedChildren="关闭"
      checked={checked}
      onChange={onChange}
    />
  );
};
/**
 * 选择知识库的按钮,暂时仍处于开发中
 */

const SelectDB = ()=>{
  return(
    <Space wrap>
    <Select
      defaultValue="Digit Store"
      style={{ width: 180 }}
      // onChange={handleChange}
      options={[
        { value: 'Digit Store', label: 'Digit Store' },
        { value: 'Clothing store', label: 'Clothing store' },
        { value: 'Manufacturing suppliers', label: 'Manufacturing suppliers' },
      ]}
    />
  </Space>
  )

}


export default MissionTable;