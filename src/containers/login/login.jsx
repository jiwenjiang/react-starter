import React, {Component} from 'react'; // 引入了React和PropTypes
import './login.less';
import url from '_config/ip/about';
import IMG from '_assets/img/background.jpg';
import IMG2 from '_assets/img/head.jpg';
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
            showImg: -1, // 当前影像列表数组索引
            imgList: [{imgUrl: IMG}, {imgUrl: IMG2}, {imgUrl: IMG}, {imgUrl: IMG},
                {imgUrl: IMG}, {imgUrl: IMG2}, {imgUrl: IMG}, {imgUrl: IMG}, {imgUrl: IMG2}, {imgUrl: IMG2}, {imgUrl: IMG2}, {imgUrl: IMG2}]
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

        this.rotParams.rot = 0;
        this.setState({
            showImg: 0,
            curImg: this.state.imgList[0].imgUrl
        }, () => {
            $('#imageView_container').imageView({width: '45%', height: '83%'});
            this.listWidth = $('.imageView_list').width();
            this.deviation = Math.round(this.listWidth / 170 / 2);
            this.totalLeft = 0;
            console.log(this.deviation)
            // this.calcList(6 + 1);
        })
    }

    calcList(i) {

        let width = i * 170;
        if (width < this.listWidth) {
            console.log('')
        } else {

            // 基本思路： 首先判断点击位后的数组个数，如果小于半个缩略图列表的长度，则基于所处位置剩余数量去进行相关长度的平移。
            // 如果点击位之后的数量大于半个缩略图列表的长度，则平移至居中位置

            let moveLength = (i - this.deviation) * 170;
            let chooseNum = this.state.imgList && this.state.imgList.length - i;
            if (chooseNum > this.deviation) {
                $('.imageView_box').animate({marginLeft: -(moveLength + 10) + 'px'}, 'normal', 'swing');
            } else {
                let coverLenth = (i - 2 * this.deviation - chooseNum) * 170;
                $('.imageView_box').animate({marginLeft: -(coverLenth + 10)});
            }


        }
    }

    initImg() {
        var img = $('#rotImg');
        img.width('auto');
        img.height('auto');
        $('#rotImg').css('max-width', '100%')
        $('#rotImg').css('max-height', '100%')
        $('#rotImg').css('margin-left', '')
        this.setState({
            rotClass: ''
        })
    }

    changeItem(v, i) {
        this.initImg();
        this.setState({
            showImg: i,
            curImg: v.imgUrl
        })
    }

    nextItem(i) {
        let isNext = this.state.showImg + i
        console.log(isNext)
        if (isNext >= 0 && isNext < this.state.imgList.length) {
            let maxNum = Math.floor(this.listWidth / 170);
            // if (isNext != 0 && isNext % maxNum == 0) {
            //     $('.imageView_box').animate({marginLeft: -(this.deviation*170 + 10) + 'px'}, 'normal', 'swing');
            // }
            // console.log($('.imageView_list').offset().left)
            // console.log($('.imageView_active').offset().left)
            // console.log('---------------')
            // console.log($('.imageView_active').offset().left - $('.imageView_list').offset().left)
            let activeLeft = $('.imageView_active').offset().left
            let listLeft = $('.imageView_list').offset().left
            if ((i > 0) && (activeLeft - listLeft > (maxNum - 1) * 170)) {
                this.totalLeft += (this.deviation * 170 + 10)
                $('.imageView_box').animate({marginLeft: -this.totalLeft + 'px'}, 'normal', 'swing');
            }
            if (i > 0 && isNext == this.state.imgList.length - 1) {
                $('.imageView_box').animate({marginLeft: -this.totalLeft - 170 + 'px'}, 'normal', 'swing');
            }
            if (i < 0 && (activeLeft - listLeft < 180) && isNext > 0) {
                this.totalLeft -= (this.deviation * 170 + 10)
                $('.imageView_box').animate({marginLeft: -this.totalLeft - 10 + 'px'}, 'normal', 'swing');
            }

            this.setState({
                showImg: this.state.showImg + i,
                curImg: this.state.imgList[this.state.showImg + i].imgUrl
            })
        }
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
    }

    turnRight() {
        this.rotParams.rot += 1;
        this.setState({
            rotClass: 'rot' + this.rotParams.rot
        }, () => {
            console.log(this.state.rotClass)
            if (this.rotParams.rot >= 3) {
                this.rotParams.rot = -1;
            }
        })
    }

    turnLeft() {
        this.rotParams.rot -= 1;
        if (this.rotParams.rot <= -1) {
            this.rotParams.rot = 3;
        }

        this.setState({
            rotClass: 'rot' + this.rotParams.rot
        }, () => {
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
        const {showImg, rotClass, imgList, curImg} = this.state;
        return (
            <div className="login-container">
                <div className="login-box">
                    <div className="login-word">
                    </div>
                    {
                        showImg != -1 ?
                            <div className="imageView_mask">
                                <div className="imageView_turnLeft"></div>
                                <div className="imageView_list">
                                    <div className="imageView_box">
                                        {
                                            imgList && imgList.map((v, i) => {
                                                return <img src={v.imgUrl} key={i}
                                                            onClick={() => this.changeItem(v, i)}
                                                            className={showImg == i ? 'imageView_active' : ''}/>
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="imageView_turnRight"></div>
                                <div className="imageView_pre">
                                    <span onClick={() => this.nextItem(-1)}>
                                        <i className="iconfont icon-you"></i>
                                    </span>
                                </div>
                                <div id="imageView_container">
                                    <img src={curImg} id="rotImg" className={rotClass}/>
                                </div>

                                <div id="imageView_editor"></div>
                                <div className="imageView_next">
                                    <span onClick={() => this.nextItem(1)}>
                                         <i className="iconfont icon-you"></i>
                                    </span>
                                </div>
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
                            <input type="button" value={showImg} onClick={() => {
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