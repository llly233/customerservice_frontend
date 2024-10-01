import { Form, ArrayField, Button, Card, Typography, withFormState } from "@douyinfe/semi-ui";
import { IconPlusCircle, IconMinusCircle } from "@douyinfe/semi-icons";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useFormContext } from './form-context';
import { IconForm, IconBadge, IconBanner, IconTree } from '@douyinfe/semi-icons-lab';
import './normalize.css';
import { Toast, useFormState } from '@douyinfe/semi-ui';
import axios from 'axios';

// HandleLinkChange 组件


//修改item的方法
const HandleItemChange = ({ itemRef, i, values }) => {
  const [focusItemValue, setFocusItemValue] = useState(null);
  const [newValues, setNewValues] = useState(values);
  const isFirstClick = useRef(true);
  let itemInput = itemRef;

  const handleChangeItem = async (oldName, focusItemValue) => {
    const itemName = String(oldName);
    const oldItemName = String(focusItemValue);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/changeItem',
        JSON.stringify({ itemName, oldItemName }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({ content: 'nav-1 modified success', duration: 3, theme: 'light' });
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'nav-1 modified error', duration: 3, theme: 'light' });
    }
  };

  useEffect(() => {
    const handleClick = () => {
      setFocusItemValue(itemInput.value);
      if (isFirstClick.current) {
        isFirstClick.current = false;
      }
    };

    const handleDocumentClick = (event) => {
      if (event.target !== itemInput) {
        ClickOver();
      }
    };

    const ClickOver = () => {
      if (newValues !== undefined && focusItemValue !== null) {
        console.log(i);
        let oldName = newValues.group[i].name;
        console.log('正在修改item', oldName, focusItemValue);
        handleChangeItem(oldName, focusItemValue);
        setFocusItemValue(null);
        isFirstClick.current = true;
      }
    };

    if (itemInput) {

      itemInput.addEventListener("click", handleClick);
      document.addEventListener("click", handleDocumentClick);
    }

    return () => {
      if (itemInput) {
        itemInput.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleDocumentClick);
      }
    };
  }, [newValues, focusItemValue]);

  useEffect(() => {
    setNewValues(values);
  }, [values]);

  return null;
};

//更改element的方法

const HandleElementChange = ({ elementRef, values, i, num }) => {
  const [focusElementValue, setFocusElementValue] = useState(null);
  const [newValues, setNewValues] = useState(values);
  const isFirstClick = useRef(true);
  let elementInput = elementRef;

  const handleChangeElement = async (newElement, focusElementValue) => {
    const itemName = String(newValues.group[num].name)
    console.log(itemName)
    const elementName = String(newElement);
    const oldElementName = String(focusElementValue);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/changeElement',
        JSON.stringify({ itemName, elementName, oldElementName }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({ content: 'nav-2 modified success', duration: 3, theme: 'light' });
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'nav-2 modified error', duration: 3, theme: 'light' });
    }
  };

  const ClickOver = () => {

    if (newValues !== undefined && focusElementValue !== null) {
      let newElementName = newValues.group[num].rules[i].itemName;
      console.log('正在修改element', newElementName, focusElementValue);
      handleChangeElement(newElementName, focusElementValue)
      setFocusElementValue(null);
      isFirstClick.current = true;
    }
  };

  const handleDocumentClick = (event) => {
    if (event.target !== elementInput.current) {
      ClickOver();
    }
  };

  useEffect(() => {
    const handleClick = () => {
      setFocusElementValue(elementInput.current.value);
      if (isFirstClick.current) {
        isFirstClick.current = false;
      }
    };

    if (elementInput.current) {
      elementInput.current.addEventListener("click", handleClick);
      document.addEventListener("click", handleDocumentClick);
    }

    return () => {
      if (elementInput.current) {
        elementInput.current.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleDocumentClick);
      }
    };
  }, [newValues, focusElementValue]);

  useEffect(() => {
    setNewValues(values);
  }, [values]);

  return null;
};



const HandleLinkChange = ({ linkRef, values, num, i }) => {
  const [newValues, setNewValues] = useState(values);
  const [focusLinkValue, setFocusLinkValue] = useState(null);
  const isFirstClick = useRef(true);

  const handleChangeLink = async (eleName, newLink) => {
    const itemName = String(newValues.group[num].name)
    console.log(itemName)
    const elementName = String(eleName);
    const oldLinkValue = String(focusLinkValue);
    const newLinkValue = String(newLink)
    try {  //尝试直接使用webhook进行触发
      const response = await axios.post(
        'http://127.0.0.1:5000/changeLink',
        JSON.stringify({ itemName, elementName, oldLinkValue, newLinkValue }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({ content: 'link modified success', duration: 3, theme: 'light' });
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'link modified error', duration: 3, theme: 'light' });
    }
  };

  const ClickOver = () => {

    if (newValues !== undefined && focusLinkValue !== null) {
      let elementName = newValues.group[num].rules[i].itemName;
      let newLinkValue = newValues.group[num].rules[i].link
      console.log('正在修改Link', elementName, focusLinkValue, newLinkValue);
      handleChangeLink(elementName, newLinkValue)
      setFocusLinkValue(null);
      isFirstClick.current = true;
    }
  };


  const handleDocumentClick = (event) => {
    if (event.target !== linkRef.current) {
      ClickOver();
    }

  };

  useEffect(() => {
    const handleClick = () => {
      setFocusLinkValue(linkRef.current.value);
      if (isFirstClick.current) {
        isFirstClick.current = false;
      }
    };

    if (linkRef.current) {
      linkRef.current.addEventListener("click", handleClick);
      document.addEventListener("click", handleDocumentClick);
    }

    return () => {
      if (linkRef.current) {
        linkRef.current.removeEventListener("click", handleClick);
        document.removeEventListener("click", handleDocumentClick);
      }
    };
  }, [newValues, focusLinkValue]);


  useEffect(() => {
    setNewValues(values);
  }, [values]);

  return null;
}








// NestedField 组件
const NestedField = (props) => {
  const elementRef = useRef([])
  const linkRef = useRef([])
  const rowStyle = {
    marginTop: 12,
    marginLeft: 12,
  };
  const num = props.num;
  // console.log('key', num)

  return (
    <ArrayField field={`${props.field}.rules`}>
      {({ add, arrayFields, addWithInitValue }) => (
        <React.Fragment>
          {arrayFields.map(({ field, key, remove }, i) => (
            <div style={{ display: "flex" }} key={key}>
              <Form.Input
                field={`${field}[itemName]`}
                label={`${field}.itemName`}
                noLabel
                style={{ width: 100, marginRight: 12 }}
                ref={(ref) => { elementRef.current = ref }} //获取对应的element所对应的ref值
              ></Form.Input>
              <HandleElementChange elementRef={elementRef} values={props.values} num={num} i={i} /> {/**传递给子组件 */}
              <div>
                <Form.Input
                  field={`${field}[link]`}
                  label={`${field}.link`}
                  noLabel
                  style={{ width: 300, marginRight: 12 }}
                  ref={(ref) => { linkRef.current = ref }}
                ></Form.Input>
                <HandleLinkChange linkRef={linkRef} values={props.values} num={num} i={i} />{/** 传递链接更改信息 */}
              </div>
              <Button
                type="danger"
                theme="borderless"
                style={rowStyle}
                icon={<IconMinusCircle />}
                onClick={() => {
                  remove();
                  props.removeElement({ text: props.items[num].text, eleName: props.items[num].items[i].text });
                }}
              />
              <Button
                icon={<IconPlusCircle />}
                style={rowStyle}
                disabled={i !== arrayFields.length - 1}
                onClick={() => {
                  // 确保新字段已添加后再调用 addElement
                  setTimeout(() => {
                    props.addElement({
                      text: props.items[num].text,
                      itemName: "名称",
                    });
                  });
                }}
              />
            </div>
          ))}
        </React.Fragment>
      )}
    </ArrayField>
  );
};


const NestArrayFieldDemo = ({ updateItems, nav_to_link, updateModalLink }) => {
  const { items, initValue, updateInitValue } = useFormContext(); //子组件获取co
  const itemRef = useRef([]);  //item的ref方法
  const [newValues, setNewValues] = useState();


  /**这一段是新增item的方法 思路是这里直接使用axios或者是fetch方法向着多维表中发送方法，然后传递回来，再通过addInitiavalue更改表单的信息 */
  const addItem = useCallback(async () => {
    console.log('正在新增项目');
    try {
      const response = await axios.get('http://127.0.0.1:5000/addItem');
      if (response.status === 200) {
        console.log(response);
        Toast.success({ content: 'nav-1 add success', duration: 3, theme: 'light' });  //保存成功进行提示
        updateInitValue(items);
        return { text: '请输入一级标题' }
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'nav-1 add error', duration: 3, theme: 'light' });
    }

  }, []);



  /**这一段是删除item的方法   中文编码问题未得到解决，只能删除英文的目录 */

  const removeItem = useCallback(async ({ text }) => {   //删除项目
    console.log('正在删除项目', text);
    try {
      const itemName = String(text); // 将项目名称进行 URL 编码
      const response = await axios.post(
        'http://127.0.0.1:5000/deleteItem',
        JSON.stringify({ itemName }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8' // 指定请求头的 Content-Type 和字符集为 UTF-8
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({ content: 'nav-1 delete success', duration: 3, theme: 'light' });  //保存成功进行提示
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'nav-1 delete fail', duration: 3, theme: 'light' });
    }
  }, []);

  /*这一段是对子项目进行新增*/

  const addElement = useCallback(async ({ text, itemName }) => {   //新增子项目
    console.log('正在删除项目', text, itemName);
    try {
      const itemName = String(text);
      const elementName = String(itemName);
      const response = await axios.post(
        'http://127.0.0.1:5000/addElement',
        JSON.stringify({ itemName, elementName }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8' // 指定请求头的 Content-Type 和字符集为 UTF-8
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({ content: 'nav-2 sdd success', duration: 3, theme: 'light' });  //保存成功进行提示
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'nav-2 add success', duration: 3, theme: 'light' });
    }
  }, []);


  /** 这一段是对子项目 进行删除的功能 */

  const removeElement = useCallback(async ({ text, eleName }) => {  //删除子项目
    console.log('正在删除Element', text, eleName);
    const itemName = String(text);
    const elementName = String(eleName);
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/deleteElement',
        JSON.stringify({ itemName, elementName }),
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8' // 指定请求头的 Content-Type 和字符集为 UTF-8
          }
        }
      );
      console.log(response.data);
      if (response.status === 200) {
        Toast.success({ content: 'nav-2 delete success', duration: 3, theme: 'light' });  //保存成功进行提示
      }
    } catch (error) {
      console.error('failed:', error);
      Toast.error({ content: 'nav-2 delete error', duration: 3, theme: 'light' });
    }
  }, []);

  const handleValueChange = (values) => {
    setNewValues(values)
  }



  return (
    <Form
      onValueChange={(values) => { handleValueChange(values) }}
      initValues={initValue}
      labelPosition="left"
      style={{ textAlign: 'left' }}
    >
      <ArrayField field="group" allowEmpty>
        {({ add, arrayFields, addWithInitValue }) => (
          <React.Fragment>
            <Button
              icon={<IconPlusCircle />}
              theme="solid"
              onClick={() => {
                const { text } = addItem();
              }}
            >
              Edit Navigation Bar 
            </Button>
            {arrayFields.map(({ field, key, remove }, i) => (
              <div
                key={key}
                style={{ width: 1000, display: "flex", flexWrap: "wrap" }}
              >
                <Form.Input
                  field={`${field}[name]`}
                  labelPosition="top"
                  label={"Nav Name"}
                  style={{ width: "600px" }}
                  ref={(ref) => (itemRef.current[i] = ref)} // 创建一个引用数组，并将每个输入框的引用存储在对应的位置上
                ></Form.Input>
                <HandleItemChange itemRef={itemRef.current[i]} i={i} values={newValues} />  {/** 创建一个子组件方便handleItemChange */}
                {/**<Form.Input> 组件通过 ref={(ref) => (itemRef.current[i] = ref)} 这样的方式被赋予了引用，然后这个引用 itemRef.current[i] 就被传递给了 <HandleItemChange> 组件作为 itemRef 属性的值。 */}
                <Button
                  type="danger"
                  style={{ margin: "36px 0 0 12px" }}
                  icon={<IconMinusCircle />}
                  onClick={() => {
                    remove();
                    removeItem({ text: items[i].text });
                  }}
                />

                <Typography.Text strong style={{ flexBasis: "100%" }}>
                  Current Navigation：
                </Typography.Text>
                <Card
                  shadow="hover"
                  style={{
                    width: 620,
                    margin: "12px 0 0 24px",
                  }}
                >
                  <NestedField field={field} items={items} addElement={addElement} removeElement={removeElement} num={i} updateModalLink={updateModalLink} values={newValues} />
                </Card>
              </div>
            ))}
          </React.Fragment>
        )}
      </ArrayField>
    </Form >
  );
};

export default NestArrayFieldDemo;
