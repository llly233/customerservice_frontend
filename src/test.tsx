import React, { useState, useEffect, useCallback } from 'react';
import { bitable } from "@lark-base-open/js-sdk";
import { Layout, Nav, Button, Breadcrumb, Skeleton, Avatar } from '@douyinfe/semi-ui';
import { IconBell, IconHelpCircle, IconBytedanceLogo, IconHome, IconHistogram, IconLive, IconSetting, IconSemiLogo } from '@douyinfe/semi-icons';
import { IconForm, IconBadge, IconBanner, IconTree } from '@douyinfe/semi-icons-lab';
import './normalize.css';
import { FormProvider } from './form-context';
import NestArrayFieldDemo from './form';
import axios from 'axios';
import ButtonDemo from './ragbutton';
import { Link, NavLink, Navigate } from "react-router-dom"


export default function NavApp() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [openKeys, setOpenKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [modalLink, setModalLink] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [showNestArrayFieldDemo, setShowNestArrayFieldDemo] = useState(false);
    const [defalutNavList, setDefalutNavList] = useState([]);
    const [items, setItems] = useState([]);
    const [formItems, setFormItem] = useState([]);

    const { Header, Sider, Content, Footer } = Layout;

    const getDefalutNavListCallback = useCallback(() => { //使用useCallback，保存函数结果，当items发生变化的时候进行重新挂载，现在还是有问题，会疯狂打印！！！
        getDefalutNavList();
    }, []);

    useEffect(() => {   //作为钩子函数，一开始就进行挂载
        getDefalutNavListCallback();
    }, [getDefalutNavListCallback]);



    const getDefalutNavList = async () => {  //获取后端返回的数据
        try {
            const response = await axios.get("http://127.0.0.1:5000/kingsoft_nav_config", {     //这里传递了后端系统的相关数据
                responseType: 'json', // 指定响应的数据类型为 JSON 格式
            });
            // console.log('这是响应的数据', response.data.data.result.视图链接);
            // const dataArray = eval(response.data);  //使用eval函数将字符串转化为数组列表，eval可以将字符串当作代码执行，但是会有注入攻击的风险，正常来说用parse就可以，这里不知道为什么用不了，使用轻微表的数据不需要这一段，飞书的需要这一段
            // console.log(dataArray);
            setDefalutNavList(response.data.data.result.视图链接);
        } catch (error) {
            console.error('Error fetching default nav list:', error);
        }
    };

    useEffect(() => {
        if (defalutNavList.length > 0) {
            const res = processRecords(defalutNavList);
            console.log('这是res', res);
            ItemEdit(res);
        } else {
            console.log('defaultNavList is empty');
        }
    }, [defalutNavList]);


    const processRecords = (records) => { //这里对数据进行提取，放入键值对
        let res = new Map();
        console.log('这是records', records);
        // 转换为数组形式
        const recordArray = Array.from(records);

        for (let i = 0; i < recordArray.length; i++) {
            let record = recordArray[i];

            let topLevelTitle = record.侧边栏一级标题;

            let secondaryTitle = record.侧边栏二级标题;
            let link = record.链接[0].address;
            let icon = record.图标;

            if (res.has(topLevelTitle)) {
                let existingData = res.get(topLevelTitle);
                existingData.push({ text: secondaryTitle, link: link, icon: icon });
                res.set(topLevelTitle, existingData);
            } else {
                let newData = [{ text: secondaryTitle, link: link, icon: icon }];
                res.set(topLevelTitle, newData);
            }
        }

        return res;
    };



    const ItemEdit = (resData) => {  //把数据放入应有的结构
        let updateItem = [];
        let updateFormItem = [];

        console.log(resData);

        for (let [key, value] of resData) {
            let iconName = value.find(item => item.icon !== '')?.icon;

            let iconComponent = null;
            switch (iconName) {
                case '<IconForm />':
                    iconComponent = <IconForm />;
                    break;
                case '<IconBadge />':
                    iconComponent = <IconBadge />;
                    break;
                case '<IconBanner />':
                    iconComponent = <IconBanner />;
                    break;
                case '<IconTree />':
                    iconComponent = <IconTree />;
                    break;
                default:
                    iconComponent = null;
            }

            updateItem.push({
                itemKey: key,
                text: key,
                icon: iconComponent,
                items: value.map((item) => ({ text: item.text, onClick: () => nav_to_link(item.link) }))
            });
            updateFormItem.push({
                itemKey: key,
                text: key,
                icon: iconComponent,
                items: value.map((item) => ({ text: item.text, link: item.link }))
            });
        }

        updateItems(updateItem);
        updateFormItems(updateFormItem)
    };

    const onSelect = (data) => {
        setSelectedKeys([data.selectedKeys]);
    };

    const onOpenChange = (data) => {
        setOpenKeys([...data.openKeys]);
    };

    const onCollapseChange = (isCollapsed) => {
        setIsCollapsed(isCollapsed);
    };

    const updateItems = (newItems) => {
        setItems(newItems);
    };
    const updateFormItems = (newItems) => {
        setFormItem(newItems);
    };

    const closeModalHandler = () => {
        setModalOpen(false);
    };

    const toggleNestArrayFieldDemo = () => {   //控制编辑按钮
        setShowNestArrayFieldDemo((prev) => !prev);
    };

    const updateModalLink = (link) => {
        setModalLink(link);
    };


    useEffect(() => {
        const ModalContent = (
            <div className='right'>
                <iframe className='modalOverlay' src={modalLink} />
                <div className='buttonsContainer'>
                    <Button onClick={closeModalHandler}>close</Button>
                    <ButtonDemo />
                </div>
            </div>
        );
        setModalContent(ModalContent);
    }, [modalLink]);


    function nav_to_link(link) {
        setModalOpen(true);
        setModalLink(link);
    }

    return (
        <FormProvider items={formItems}>
            <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
                <Sider style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                    <div style={{ display: 'flex' }}>
                        <Nav
                            defaultSelectedKeys={['首页']}
                            isCollapsed={isCollapsed}
                            style={{ maxWidth: 300, height: '950px' }}
                            openKeys={openKeys}
                            selectedKeys={selectedKeys}
                            bodyStyle={{ height: 360 }}
                            items={items}
                            header={{
                                logo: <IconSemiLogo style={{ height: '36px', fontSize: 36 }} />,
                                text: 'Configuration ',
                            }}
                            footer={{
                                collapseButton: true,
                            }}
                            onCollapseChange={onCollapseChange}
                            onOpenChange={onOpenChange}
                            onSelect={onSelect}
                        />
                        {showNestArrayFieldDemo ? (
                            <NestArrayFieldDemo
                                updateItems={updateItems}
                                nav_to_link={(link) => nav_to_link(link)}
                                updateModalLink={updateModalLink}
                            />
                        ) : null}
                        {isModalOpen ? modalContent : null}
                    </div>
                </Sider>
                <Layout>
                    <Header style={{ backgroundColor: 'var(--semi-color-bg-1)' }}>
                        <Nav
                            mode="horizontal"
                            footer={
                                <>
                                    <Button  style={{
                                            marginRight: '12px',
                                        }} onClick={toggleNestArrayFieldDemo}>Edit project</Button>
                                    {/* <Button
                                        theme="borderless"
                                        icon={<IconBell size="large" />}
                                        style={{
                                            color: 'var(--semi-color-text-2)',
                                            marginRight: '12px',
                                        }}
                                    /> */}
                                    {/**下面这里设计的是点击跳转登录页 */}
                                    <NavLink to="/Aiconfig" style={{ textDecoration: 'none' }}>
                                        <Button
                                            theme="borderless"
                                            icon={<IconBell size="large" />}
                                            style={{
                                                color: 'var(--semi-color-text-2)',
                                                marginRight: '12px',
                                            }}
                                        >AI Config</Button>
                                    </NavLink>
                                    <Avatar color="orange" size="small">
                                        YTZ
                                    </Avatar>
                                </>
                            }
                        ></Nav>
                    </Header>
                </Layout>
            </Layout>
        </FormProvider>
    );
}

