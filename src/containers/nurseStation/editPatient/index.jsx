import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col, Select, Modal, Button} from 'antd';
import url from '../../../config/ip/nurseStation/nurseStation';
import xhr from '../../../services/xhr/index';
import './index.less';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import StatusTag from '../../../component/common/statusTag/statusTag';
import PatientForm from './form';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';


const [Option] = [Select.Option];
let mediaStreamTrack, video, canvas;


class Main extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            patientInfo: {},
            registerInfo: {},
            dicts: {},
            options: []
        };
    }

    componentDidMount() {
        const titles = [
            {link: '/home/nurseStation/curPatient', text: '护士工作站'},
            {link: `/home/nurseStation/checkPatient/${this.props.params.id}`, text: '患者详情'},
            {link: `/home/nurseStation/editPatient/${this.props.params.id}`, text: '编辑信息'}
        ];
        this.props.setTitle(titles);
        this.getDetail();
        this.getDicts();
        this.getOptions();
        this.validImg = false;
    }

    getDetail() {
        xhr.get(url.patientDetail, {patientId: this.props.params.id}, (data) => {
            const info = data && data.patientInfoDetailDTO;
            this.setState({
                patientInfo: info,
                registerInfo: data && data.patientRegisterDetailDTO,
                fileUrl: info && info.headImage
            });
        })
    }

    getDicts() {
        const types = ['sex', 'job_type', 'is_married', 'expense_category', 'therapy_tech'].reduce((o, n) => {
            return o + n + ','
        }, '')

        xhr.get(url.dictionarys, {types: types}, (dicts) => {
            for (let key in dicts) {
                if (key != 'sex') {
                    dicts[key] = dicts[key] && dicts[key].map(v => {
                            return <Option key={v.id.toString()}>{v.bdName}</Option>;
                        });
                } else {
                    dicts[key] = dicts[key] && dicts[key].map(v => {
                            return {label: v.bdName, value: v.id};
                        });
                }
            }
            this.setState({
                dicts
            });
        })
    }

    async getOptions() {
        let getOrg = () => {
            // 科室
            return new Promise((resolve) => {
                xhr.get(url.getOrg, {}, (data) => {
                    let arr = data.map(v => {
                        return <Option key={v.id}>{v.name}</Option>;
                    })
                    resolve(arr);
                })
            })
        }

        let wardOrg = () => {
            // 病区
            return new Promise((resolve) => {
                xhr.get(url.getWards, {}, (data) => {
                    let arr = data.map(v => {
                        return <Option key={v.id}>{v.name}</Option>;
                    })
                    resolve(arr);
                })
            })
        }

        let doctors = () => {
            // 放疗医生
            return new Promise((resolve) => {
                xhr.get(url.getThyDocs, '', (data) => {
                    let arr = data.map(v => {
                        return <Option key={v.doctorId}>{v.doctorName}</Option>
                    });
                    resolve(arr);
                })
            })
        }
        const options = await Promise.all([getOrg(), wardOrg(), doctors()]);
        this.setState({
            options
        });
    }

    imgError() {
        this.setState({
            fileUrl: null
        });
    }

    handleFile = (e) => {
        let file = e.target.files;
        this.validImg = false;
        this.setState({
            upfile: false
        })
        if (file.length === 0) return;
        if (file[0].size > 5 * 1024 ) {
            this.validImg = true;
            this.setState({
                upfile: true
            })
        }
        this.setState({fileUrl: window.URL.createObjectURL(file[0]), file: file[0]});
    };

    snapImage = () => {
        video = this.refs.video;
        // canvas = this.refs.canvas;
        let getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(stream => {
                mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }).catch(err => {
                console.log(err)
            })
        }
        else if (getMedia) {
            navigator.getMedia({
                video: true
            }, (stream) => {
                mediaStreamTrack = stream.getTracks()[0];
                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }, (err) => {
                console.log(err)
            });
        }
        this.setState({snapVisible: true})
    };

    handlePreview = () => {
        this.setState({previewVisible: true})
    };

    handleCancel = () => {
        this.setState({previewVisible: false})
    };

    snapHeadImg = () => {
        canvas = this.refs.canvas;
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 200, 150);
    };

    getSnap = () => {
        mediaStreamTrack && mediaStreamTrack.stop();
        this.setState({fileUrl: canvas.toDataURL('image/png'), snapVisible: false})
    };

    cancelSnap = () => {
        mediaStreamTrack && mediaStreamTrack.stop();
        this.setState({snapVisible: false})
    };

    render() {
        // const patientInfo = this.state.patientInfo;
        const registerInfo = this.state.registerInfo;
        return (
            <div className="mg-top20">
                <Row>
                    <Col xl={4} lg={5} md={7} sm={8} className="img-detail">
                        <div className="part">
                            {this.state.fileUrl
                                ? <img id="imageFile" src={this.state.fileUrl} onError={(e) => {
                                    this.imgError(e)
                                }} onClick={this.handlePreview}/>
                                : <i className="iconfont icon-default-head defaultHeat"></i>}
                            <div style={{'marginTop': '-7px'}}>
                                <StatusTag status={registerInfo.status} taskName={registerInfo.taskName}/>
                            </div>
                            <p>
                                <span className="code">放疗编号 :</span>
                                <span className="num">&emsp;{registerInfo.radiotherapyNumber}</span>
                            </p>
                            <div className="mg-top20">
                                <Row>
                                    <Col lg={12} md={24}>
                                        <button className="link-btn-n" onClick={this.snapImage}>拍摄照片</button>
                                    </Col>

                                    <Col lg={12} md={24}>
                                        <button className="link-btn-n" onClick={() => {
                                            this.refs.file.click()
                                        }}>上传照片
                                        </button>
                                        <input type="file" ref="file" style={{'display': 'none'}}
                                               onChange={this.handleFile} accept="image/jpeg,image/png,image/gif"/>
                                    </Col>
                                </Row>
                            </div>
                            <div>
                                {this.state.upfile
                                    ? <p style={{fontSize: '12px', color: '#f04134', marginTop: '0px'}}>
                                        图片超过限制大小5M</p>
                                    : false
                                }
                            </div>
                        </div>
                    </Col>
                    <Col xl={20} lg={19} md={17} sm={16}>
                        <PatientForm {...this.state} validImg={this.validImg}></PatientForm>
                    </Col>
                </Row>
                <div className="clearfix"></div>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img src={this.state.fileUrl} style={{width: '100%'}}/>
                </Modal>
                <Modal visible={this.state.snapVisible} title="拍取头像"
                       onOk={this.getSnap} onCancel={this.cancelSnap}
                       footer={[
                           <Button key="cancel" size="large" onClick={this.cancelSnap}>取消</Button>,
                           <Button key="snap" size="large" type="primary" onClick={this.snapHeadImg}>拍照</Button>,
                           <Button key="submit" size="large" type="primary" onClick={this.getSnap}>确定</Button>
                       ]}>
                    {mediaStreamTrack ? (
                        <div>
                            <video ref="video" style={{width: 200, height: 150}}></video>
                            <canvas ref="canvas" style={{width: 200, height: 150}}></canvas>
                        </div>
                    ) : ('没有检测到摄像头。')}

                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setTitle: subTitle
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);