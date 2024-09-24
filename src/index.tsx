import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
// import "./normalize.css";
import NavApp from './test';
import Component from './component';
import ButtonDemo from './ragbutton'
import { BrowserRouter } from "react-router-dom";
import Router from './router'
// import {
//   createBrowserRouter,
//   createRoutesFromElements,
//   Route,
//   RouterProvider,
// } from "react-router-dom";  第二个需要复杂定义以及嵌套路由与数据加载中使用

const Root = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <React.StrictMode>
      <NavApp />
    </React.StrictMode>
  );
};

createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
/* 根据登录状态决定渲染哪个组件    {loggedIn ? <NavApp /> : <Component onLogin={() => setLoggedIn(true)} />}  */