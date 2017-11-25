import {notification} from 'antd';

const openNotificationWithIcon = (type, msg) => {
    notification[type]({
        message: msg,
        duration: 1
    });
};

export default openNotificationWithIcon;
