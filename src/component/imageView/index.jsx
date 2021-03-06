import React, {Component} from 'react'; // 引入了React和PropTypes
import {Input, Select, DatePicker} from 'antd';

import {PureRender} from '_services/decorator'
import './index.less';
import './viewer';
import $ from 'jquery';
const [Option] = [Select.Option];


/* 以类的方式创建一个组件 */
@PureRender()
class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showImg: -1,
            imgList: []
        };
        this.marginLeft = 0;
        this.rotParams = {
            right: document.getElementById('rotRight'),
            left: document.getElementById('rotLeft'),
            img: document.getElementById('rotImg'),
            rot: 0
        }
    }

    componentDidMount() {
        $(window).resize(function () {          //当浏览器大小变化时
            $('#imageView_editor').css('left', document.body.offsetWidth * 0.15 + $('#imageView_container').width() + 'px')
        });
    }

    componentDidUpdate() {
        // console.log(this.props)
    }

    openImage() {
        this.rotParams.rot = 0;
        this.setState({
            showImg: this.props.showImg,
            imgList: this.props.imgList,
            curImg: this.props.imgList[0].imgUrl
        }, () => {
            $('#imageView_container').imageView({width: document.body.offsetWidth - '310px', height: '83%'});
            this.listWidth = $('.imageView_list').width();
            $('#imageView_editor').css('left', document.body.offsetWidth * 0.15 + $('#imageView_container').width() + 'px')
            this.deviation = Math.round(this.listWidth / 170 / 2);
            this.totalLeft = 0;
            this.imgListNum = Math.round(this.listWidth / 170);
            this.imgListLength = this.state.imgList.length * 170;
            // console.log(this.deviation)
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
            rotClass: '',
            imgError: false
        })
    }

    imgError() {
        console.log('err')
        this.setState({
            imgError: true
        })
    }

    imgSucc() {
        console.log('succ')
        this.setState({
            imgError: false
        })
    }

    changeItem(v, i) {
        this.initImg();
        this.setState({
            showImg: i,
            curImg: v.imgUrl
        })
    }

    toShowTool(showTool) {
        this.setState({
            showTool
        })
    }

    nextItem(i) {
        this.initImg();
        let isNext = this.state.showImg + i
        if (isNext >= 0 && isNext < this.state.imgList.length) {
            let maxNum = Math.floor(this.listWidth / 170);
            // if (isNext != 0 && isNext % maxNum == 0) {
            //     $('.imageView_box').animate({marginLeft: -(this.deviation*170 + 10) + 'px'}, 'normal', 'swing');
            // }
            let activeLeft = $('.imageView_active').offset().left
            let listLeft = $('.imageView_list').offset().left
            // 向右平移
            if ((i > 0) && (activeLeft - listLeft > (maxNum - 1) * 170)) {
                this.totalLeft += (this.deviation * 170 )
                $('.imageView_box').animate({marginLeft: -this.totalLeft - 10 + 'px'}, 'normal', 'swing');
            }
            // 最后不足半屏
            if (i > 0 && isNext == this.state.imgList.length - 1) {
                $('.imageView_box').animate({marginLeft: -this.totalLeft - 180 + 'px'}, 'normal', 'swing');
            }
            // 向左平移
            if (i < 0 && (activeLeft - listLeft < 180) && isNext > 0) {
                if (isNext > this.imgListNum) {
                    this.totalLeft -= (this.deviation * 170)
                } else {
                    this.totalLeft = 0;
                }
                $('.imageView_box').animate({marginLeft: -this.totalLeft - 10 + 'px'}, 'normal', 'swing');
            }

            this.setState({
                showImg: this.state.showImg + i,
                curImg: this.state.imgList[this.state.showImg + i].imgUrl
            })
        }
    }

    nextArr(i) {
        let arrMove = Math.floor(this.listWidth / 170) * 170;
        if ((this.imgListLength - this.totalLeft < this.listWidth) && (i > 0)) {
            return false
        }
        if (this.totalLeft == 0 && (i < 0)) {
            return false
        }
        if ((this.totalLeft > 0 && this.totalLeft < this.listWidth) && i < 0) {
            this.totalLeft = 0
            $('.imageView_box').animate({marginLeft: -this.totalLeft - 10 + 'px'}, 'normal', 'swing');
            return false
        }
        if (i > 0) {
            this.totalLeft += arrMove
        } else {
            this.totalLeft -= arrMove
        }
        $('.imageView_box').animate({marginLeft: -this.totalLeft - 10 + 'px'}, 'normal', 'swing');
        // this.setState({
        //     showImg: this.state.showImg + i * goLength,
        //     curImg: this.state.imgList[this.state.showImg + i * goLength].imgUrl
        // })
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

    closeModal() {
        this.setState({
            showImg: -1
        })
    }

    render() {
        const {rotClass, imgList, showTool, showImg, imgError, curImg} = this.state;
        return (
            <div>
                {
                    showImg != -1 ?
                        <div className="imageView_mask">
                            <div className="imageView_turnLeft">
                                <i className="iconfont icon-zuo" onClick={() => this.nextArr(-1)}></i>
                            </div>
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
                            <div className="imageView_turnRight">
                                <i className="iconfont icon-you1" onClick={() => this.nextArr(1)}></i>
                            </div>
                            <div className="imageView_pre">
                                    <span onClick={() => this.nextItem(-1)}>
                                        <i className="iconfont icon-zuo"></i>
                                    </span>
                            </div>
                            <div id="imageView_container" onMouseEnter={() => this.toShowTool(1)}
                                 onMouseLeave={() => this.toShowTool(0)}>
                                {showTool ?
                                    <div className="imageView_tools">
                                        <i className="iconfont icon-fangda" onClick={() => {
                                            this.imgToSize(100)
                                        }}></i>
                                        <i className="iconfont icon-suoxiao" onClick={() => {
                                            this.imgToSize(-100)
                                        }}></i>
                                        <i className="iconfont icon-nishizhen" onClick={() => {
                                            this.turnLeft()
                                        }}></i>
                                        <i className="iconfont icon-shunshizhen" onClick={() => {
                                            this.turnRight()
                                        }}></i>
                                    </div> : ''
                                }
                                {
                                    imgError
                                        ? <div className="errorImg">
                                        <i className="iconfont icon-shunshizhen"></i>
                                    </div>
                                        : <img src={curImg} id="rotImg" onError={() => this.imgError()}
                                               className={rotClass}/>
                                }

                            </div>
                            <div id="imageView_editor">
                                <div className="imageView_close">
                                    <span>查看文件</span>
                                    <i className="iconfont icon-guanbi" onClick={() => this.closeModal()}></i>
                                </div>
                                <div className="imageView_content">
                                    <ul>
                                        <li>
                                            <label>文件名称：</label>
                                            <Input size="large" style={{width: '192px'}} placeholder="large size"/>
                                        </li>
                                        <li>
                                            <label>附件分类：</label>
                                            <Select style={{width: 192}} size="large" dropdownStyle={{zIndex: 7000}}>
                                                <Option value="jack">Jack</Option>
                                                <Option value="lucy">Lucy</Option>
                                                <Option value="disabled" disabled>Disabled</Option>
                                                <Option value="Yiminghe">yiminghe</Option>
                                            </Select>
                                        </li>
                                        <li>
                                            <label>报告时间：</label><DatePicker
                                            getCalendarContainer={() => document.querySelector('.imageView_content')}
                                            style={{width: 192}} size="large"/>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="imageView_next">
                                    <span onClick={() => this.nextItem(1)}>
                                         <i className="iconfont icon-you1"></i>
                                    </span>
                            </div>
                        </div> : ''
                }
            </div>
        );
    }
}

export default Main;