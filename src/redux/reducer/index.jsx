// import {fromJS} from 'immutable';
// import {LOADING} from '../constants/dispatchTypes';

// import Login from './login/loginReducer'; // 登录界面

// 初始化state数据
const initialState = {
    loading: false
};

/**
 * 公共reducer
 * @return
 */

const Common = (state = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
}

export {Common};