import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Nav, Avatar, Form, Checkbox, Button } from '@douyinfe/semi-ui';
import { IconSemiLogo, IconFeishuLogo, IconHelpCircle, IconBell } from '@douyinfe/semi-icons';
import styles from './index.module.css';
import axios from 'axios';

const Component = () => {  //
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const redirectTo = searchParams.get('redirect') || '/Aiconfig';  //上面的是reactrouter的钩子

  const setItemWithExpiry = (key, value, ttl) => {
    const now = new Date();

    // `ttl` 是有效时间（毫秒）
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://94eoau696923.vicp.fun/login', { username, password });
      if (response.data.message === 'Login successful') {
        console.log('Login successful');
        // localStorage.setItem('isAuthenticated', 'true'); //在web浏览器中保存登录状态
        setItemWithExpiry('Admin', { name: 'ytz', scope: 'supManager' }, 1800000)  //设置登录状态
        navigate(redirectTo);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  return (  //以下为原生的登陆页面
    <div className={styles.rootSignupLogins}>
      <div className={styles.main}>
        <div className={styles.login}>
          <div className={styles.component66}>
            <img
              src="https://lf9-static.semi.design/obj/semi-tos/template/caee33dd-322d-4e91-a4ed-eea1b94605bb.png"
              className={styles.logo}
            />
            <div className={styles.header}>
              <p className={styles.title}>Welcome Back</p>
              <p className={styles.text}>
                <span className={styles.text}>Logon</span>
                <span className={styles.text1}> RAG AI Assistant </span>
                <span className={styles.text2}>account</span>
              </p>
            </div>
          </div>
          <div className={styles.form}>
            <Form className={styles.inputs}>
              <label>usename</label>
              <input
                type="text"
                placeholder="Please enter user name"
                value={username}
                onChange={e => setUsername(e.target.value)}  //通过onChange方法传递登陆信息
                style={{ width: "100%", alignSelf: "stretch", padding: 0 }}
              />
              <label>password</label>
              <input
                type="password"
                placeholder="Please input a password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: "100%", alignSelf: "stretch", padding: 0 }}
              />
            </Form>
            <Checkbox type="default">remember</Checkbox>
            <Button theme="solid" className={styles.button} onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Component;
