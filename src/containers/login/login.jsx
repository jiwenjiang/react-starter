import React, {Component} from 'react'; // 引入了React和PropTypes
import './login.less';
import url from '_config/ip/about';
import xhr from '_services/xhr/index';
import {browserHistory} from 'react-router';
import {PureRender} from '_services/decorator'
import ImageView from '_component/imageView';
import IMG from '_assets/img/background.jpg';
import IMG2 from '_assets/img/head.jpg';


/* 以类的方式创建一个组件 */
@PureRender()
class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            orgs: [],
            showImg: -1 // 当前影像列表数组索引
        };
    }

    componentDidMount() {

    }

    submit() {
        this.setState({
            showImg: 0,
            imgList: [{imgUrl: IMG}, {imgUrl: IMG2}, {imgUrl: IMG}, {imgUrl: IMG},
                {imgUrl: IMG}, {imgUrl: IMG2}, {imgUrl: IMG}, {imgUrl: IMG}, {imgUrl: IMG2}, {imgUrl: IMG2}, {imgUrl: IMG2}, {imgUrl: IMG2}]
        }, () => {
            this.refs.imageView.openImage();
        })
    }


    async login(param) {
        await this.toLogin(param);
    }

    toLogin(param) {
        browserHistory.push('/home/image');
        return new Promise((resolve) => {
            xhr.post(url.login, param, (data) => {
                resolve(data);
                xhr.init(data.accessToken)
                sessionStorage.accessToken = data.accessToken;
                browserHistory.push('/home/nurseStation/curPatient');
            })
        })
    }

    render() {
        const {showImg, imgList} = this.state;
        return (
            <div className="login-container">
                <div className="login-box">
                    <div className="login-word">
                    </div>
                    <ImageView showImg={showImg} ref="imageView" imgList={imgList}/>
                    <div className="page-region">
                        <div className="login-title">
                            <span>J_BLEACH</span>
                        </div>
                        <div className="login-form" onKeyUp={(e) => this.submit(e)}>
                            <p>
                                <input type="text" placeholder="请输入用户名" ref='username'/>
                                <i className="iconfont icon-geren-"></i>
                            </p>
                            <p>
                                <input type="password" placeholder="请输入密码" ref='psw'/>
                                <i className="iconfont icon-mima"></i>
                            </p>
                        </div>
                        <div className="submit">
                            <button onClick={() => {
                                this.submit()
                            }} onKeyUp={(e) => this.submit(e)}>登&emsp;录
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
// if (e && e.keyCode !== 13) {
//     return false;
// }
//
// if (this.refs.username.value && this.refs.psw.value) {
//     this.login({
//         userName: this.refs.username.value,
//         userPassword: this.refs.psw.value
//     })
// }
// var data = {
//     page: {
//         count: '',
//         total: 1
//     }
// }
// function fn(param, data) {
//     if (data) {
//         return param.split('?.').every(function (v) {
//             return data[v] ? (data = data[v] , true) : false
//         })
//     }
//     else {
//         return false
//     }
// }
//
// var a = fn('page?.count', data)
// console.log(a)

export default Main;