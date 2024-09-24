import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const FormContext = createContext();

export const FormProvider = ({ children, items }) => {
  const [initValue, setInitValue] = useState(getInitValue(items)); // 初始化 initValue

  useEffect(() => {
    // 当 items 发生变化时，更新 initValue
    setInitValue(getInitValue(items));
  }, [items]);

  const updateInitValue = (newItems) => {
    // 生成新的 initValue
    const newInitValue = getInitValue(newItems);
    // 更新 initValue
    setInitValue(newInitValue);
  };


  const contextValue = useMemo(() => ({ items, initValue, updateInitValue }), [items, initValue, updateInitValue]);

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

const getInitValue = (items) => {
  return {
    group: items.map(item => ({
      name: item.text,
      rules: item.items?.map(element => ({
        itemName: element.text,
        link: element.link,
      })) || [],
    })),
  };
};
