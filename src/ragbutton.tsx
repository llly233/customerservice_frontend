import React, { useState } from 'react';
import { Button, Toast } from '@douyinfe/semi-ui';
import { IconDelete } from '@douyinfe/semi-icons';
import axios from 'axios';

const ButtonDemo = () => {
    const [saveLoading, setSaveLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(true);
    const [repLoading, setRepLoading] = useState(true);

    const saveRagKnowledge = async () => {
        try {
            const response = await axios.get('https://94eoau696923.vicp.fun/save_rag_knowledge');
            console.log(response)
            if (response.status === 200) {
                console.log(response);
                setSaveLoading(false);
                Toast.success({ content: 'save success', duration: 3, theme: 'light' });  //保存成功进行提示
            }
        } catch (error) {
            console.error('failed:', error);
            Toast.error({ content: 'save error', duration: 3, theme: 'light' });
        }
    };

    const reset = status => {
        status = !!status;
        setSaveLoading(status);
        setDelLoading(status);
        setRepLoading(status);
    };

    return (
        <div>
            <Button loading={saveLoading} onClick={() => {
                setSaveLoading(true);
                saveRagKnowledge();
            }} style={{ marginRight: 14 }}>save</Button>
        </div>
    );
}

export default ButtonDemo;
