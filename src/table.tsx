import React, { useMemo, useState } from 'react';
import { Space, Table } from 'antd';
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
    dataIndex: 'rag',
    key: 'rag',
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
        {record.run === 'true' ? "open" : "pause"}
        <a onClick={() => deleteAiConfig(record.name)}>Delete</a>
      </Space>
    ),
  },
];
const deleteAiConfig = async ({ Name }) => {   //删除Ai配置
  console.log('正在删除项目', Name);
  try {
    const missionName = String(Name); // 将项目名称进行 URL 编码
    const response = await axios.post(
      'https://94eoau696923.vicp.fun/deleteaiconfig',
      JSON.stringify({ missionName }),
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

export default MissionTable;