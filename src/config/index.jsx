const process = require('process');
const Main = {//http://192.168.0.141:50000/  // http://192.168.0.115:9001/
    collectTarget: process.env.NODE_ENV !== 'production' ? 'http://192.168.0.141:50000/' : 'http://192.168.0.141:50000/', //目标网站
    imageTarget: process.env.NODE_ENV !== 'production' ? 'http://192.168.0.115:9001/' : 'http://192.168.0.115:9001/', //目标网站
    name: 'Ant Design Admin',
    platform:'LM-OIS',
    prefix: 'antdAdmin',
    logoSrc: 'https://t.alipayobjects.com/images/rmsweb/T1B9hfXcdvXXXXXXXX.svg',
    logoText: 'Linking Med',
    needLogin: true,
    localKey: { // 本地存储Key
        userToken: 'USER_AUTHORIZATION'
    },
    /**
     * 本地数据存储或读取
     *
     * @param {any} key
     * @param {any} value
     * @returns
     */
    localItem(key, value) {
        if (arguments.length == 1) {
            return localStorage.getItem(key) && localStorage.getItem(key) !== 'null' ? localStorage.getItem(key) : null;
        } else {
            return localStorage.setItem(key, value);
        }
    },
    /**
     * 删除本地数据
     *
     * @param {any} k
     * @returns
     */
    removeLocalItem(key) {
        if (arguments.length == 1) {
            return localStorage.removeItem(key);
        } else {
            return localStorage.clear();
        }
    }
};

export default Main;
