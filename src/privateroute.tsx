// src/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const getItemWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);

  // 如果没有找到该键，返回 null
  if (!itemStr) {
    return null;
  }

  const item = JSON.parse(itemStr);
  const now = new Date();

  // 检查是否过期
  if (now.getTime() > item.expiry) {
    // 如果过期了，删除该项目并返回 null
    localStorage.removeItem(key);
    return null;
  }

  return item.value;
}
const PrivateRoute = ({ children }) => {

  const itemValue = getItemWithExpiry('Admin')

  return itemValue ? children : <Navigate to="/login" />;  //Navgate可以立即重定向到该页面，不需要用户点击触发
};

export default PrivateRoute;
