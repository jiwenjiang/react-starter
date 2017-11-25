const Main = {
    collectTarget: PRODUCTION ? LM_IP.OIS : 'http://192.168.0.70:50000/', //ois
    assembleOis: PRODUCTION ? LM_IP.assembleOis : 'http://192.168.0.115:40001/', //dicomOis
    assembleViewer: PRODUCTION ? LM_IP.assembleViewer : 'http://192.168.0.115:40002/', //dicomViewer
    assembleServer: PRODUCTION ? LM_IP.assembleServer : 'http://192.168.0.115:40003/', //dicomViewer
    viewer: PRODUCTION ? LM_IP.viewer : 'http://test.viewer.raic.linkingmed.com/viewer/#/main/contour', //viewer
    name: 'Ant Design Admin',
    platform: 'LM-OIS',
    prefix: 'antdAdmin',
    logoSrc: '',
    logoText: 'J-bleach',
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
