import noty from '../../component/common/noty';
import axios from 'axios';
import {browserHistory} from 'react-router';
import Rx from 'rxjs/Rx';


axios.defaults.headers.common['accessToken'] = sessionStorage.accessToken;
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';


const http = {};
let count = 0;
const observable = Rx.Observable.create((observer) => {
    observer.next(count++)
})


http.format = (res, succ = () => {}, err = () => {}) => {
    if (res.data.errcode === 0) {
        if (res.config.method != 'get') {
            if (res.data.errmsg) {
                noty('success', res.data.errmsg);
            }
        }
        succ(res.data.data);
    } else {
        if (res.data.errcode === 10001) {
            observable.subscribe(v => {
                if (v === 0) {
                    noty('error', '该账户已在其他地方登录');
                    browserHistory.push('/login');
                }
            })
            return false;
        }
        noty('error', res.data.errmsg);
        err(res.data.data);
    }
}

http.init = (token) => {
    axios.defaults.headers.common['accessToken'] = token;
    count = 0;
}

http.get = (url, data, succ, err) => {
    axios.get(url, {params: data})
        .then((res) => {
            http.format(res, succ)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}

http.post = (url, data, succ, set, err) => {
    axios.post(url, data, set)
        .then((res) => {
            http.format(res, succ, err)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}

http.put = (url, data, succ, err) => {
    axios.put(url, data)
        .then((res) => {
            http.format(res, succ)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}

http.delete = (url, data, succ, err) => {
    axios.delete(url, {
        data: data
    })
        .then((res) => {
            http.format(res, succ)
        })
        .catch((error) => {
            err ? err(error) : false
        })
}


export default http;