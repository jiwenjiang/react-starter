import { notification } from 'antd';

const openNotificationWithIcon = (type,msg) => {
    notification[type]({
        message: msg
    });
};

export default openNotificationWithIcon;
