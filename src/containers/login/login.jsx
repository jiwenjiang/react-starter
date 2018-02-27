import React, {Component} from 'react'; // 引入了React和PropTypes
import './login.less';
import url from '_config/ip/about';
import IMG from '_assets/img/background.jpg';
import xhr from '_services/xhr/index';
import {browserHistory} from 'react-router';
import {PureRender} from '_services/decorator'
import './viewer.less';
import './viewer';
import $ from 'jquery';


/* 以类的方式创建一个组件 */
@PureRender()
class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            status: 0,
            orgs: [],
            showImg: false
        };
    }

    componentDidMount() {
        this.marginLeft = 0;
        this.data = {
            page: {
                count: '',
                total: 1
            }
        }
        this.rotParams = {
            right: document.getElementById('rotRight'),
            left: document.getElementById('rotLeft'),
            img: document.getElementById('rotImg'),
            rot: 0
        }
    }

    submit() {
        this.setState({
            showImg: true
        }, () => {

            $('#imageView_container').imageView({width: '60%', height: '70%'});
        })
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

    imgToSize(size) {
        var img = $('#rotImg');
        var oWidth = img.width(); //取得图片的实际宽度
        var oHeight = img.height(); //取得图片的实际高度
        if ((oWidth < 100 || oHeight < 100) && size < 0) {
            return false
        }
        if (size > 0) {
            this.marginLeft += 50
        } else {
            this.marginLeft -= 50
        }
        $('#rotImg').css('max-width', oWidth + size)
        $('#rotImg').css('max-height', oHeight + size / oWidth * oHeight)


        img.width(oWidth + size);
        img.height(oHeight + size / oWidth * oHeight);
        $('#rotImg').css('margin-left', -this.marginLeft)

        console.log(this.marginLeft)
    }

    turnRight() {
        this.rotParams.rot += 1;
        this.setState({
            rotClass: 'rot' + this.rotParams.rot
        }, () => {
            console.log(this.state.rotClass)
            if (this.rotParams.rot === 3) {
                this.rotParams.rot = -1;
            }
        })
    }

    turnLeft() {
        this.rotParams.rot -= 1;
        if (this.rotParams.rot === -1) {
            this.rotParams.rot = 3;
        }

        this.setState({
            rotClass: 'rot' + this.rotParams.rot
        }, () => {
            console.log(this.state.rotClass)
        })
    }

    render() {
        const {showImg, rotClass} = this.state;
        return (
            <div className="login-container">
                <div className="login-box">
                    <div className="login-word">
                        <ul>

                        </ul>
                    </div>
                    {
                        showImg ?
                            <div className="imageView_mask">
                                <div id="imageView_container">
                                    <img src={IMG} id="rotImg" className={rotClass} />
                                </div>
                                <div id="imageView_editor"></div>
                            </div> : ''
                    }
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
                        <div style={{paddingTop: '5px', zIndex: 3000, position: 'relative'}}>
                            <input type="button" value="放大" onClick={() => {
                                this.imgToSize(100)
                            }}/>
                            <input type="button" value="缩小" onClick={() => {
                                this.imgToSize(-100)
                            }}/>
                            <input type="button" value="向右旋转" id="rotRight" onClick={() => {
                                this.turnRight()
                            }}/>
                            <input type="button" value="向左旋转" id="rotLeft" onClick={() => {
                                this.turnLeft()
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Main;