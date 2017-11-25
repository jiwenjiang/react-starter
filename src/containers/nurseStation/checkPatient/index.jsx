import React, {Component} from 'react';
import {Col, Row, Modal} from 'antd';
// import Moment from 'moment';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import '../../../assets/fonts/iconfont.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import url from '../../../config/ip/nurseStation/nurseStation';
import xhr from '../../../services/xhr/index';
import {browserHistory} from 'react-router';
import './checkPatient.less';

const confirm = Modal.confirm;

class checkPatient extends Component {
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        console.log(this.props);
        this.state = {
            patientId: this.props.params.id,
            patientInfo: {},
            patientRegister: {}
        }
    }

    componentDidMount(){
        const titles = [
            {link: `/home/nurseStation/curPatient/${1}`, text: '患者列表'},
            {link: `/home/nurseStation/checkPatient/${this.state.patientId}`, text: '患者详情'}
        ];
        this.props.setTitle(titles);
        this.getInfo(this.state.patientId);
    }

    getInfo = (id) => {
        xhr.get(url.patientDetail, {patientId: id}, (data) => {
            this.setState({
                patientInfo: data.patientInfoDetailDTO,
                patientRegister: data.patientRegisterDetailDTO
            })
        })
    };

    gotoEdit = (id) => {
        browserHistory.push(`/home/nurseStation/editPatient/${id}`)
    };

    delPatient = (id) => {
        confirm({
            title: '确认',
            content: '确认要删除这个患者吗？',
            onOk: () => {
                xhr.delete(url.delPatient, {patientId: id}, () => {
                    browserHistory.push('/home/nurseStation/curPatient/1')
                })
            }
        });
    };

    imgError = () => {
        this.setState({
            patientInfo: {
                ...this.state.patientInfo,
                headImage: null
            }
        });
    }

    render() {
        const status = {
            '进行中': 'process',
            '异常': 'abnormal',
            '结束': 'end'
        };
        return (
            <div className="checkPatient">
                <Row gutter={16}>
                    <Col xl={5} lg={5} md={6} sm={8} xs={24}>
                        <div className="display-left">
                            <div className="photo-area">
                                {this.state.patientInfo.headImage ? <img src={this.state.patientInfo.headImage} onError={this.imgError} /> : <i className="iconfont icon-geren-"></i>}
                            </div>
                            <div className="name">{this.state.patientInfo.name || '--'}</div>
                            <div className="text"><span>放疗编号：</span>{this.state.patientRegister.radiotherapyNumber || '--'}</div>
                            <div className="text"><span>当前状态：</span><span className={status[this.state.patientRegister.status] || '--'}>{this.state.patientRegister.status || ''}</span></div>
                            <div className="text"><span>当前流程：</span>{this.state.patientRegister.taskName || '--'}</div>
                            <Row>
                                <Col span={24}>
                                    <button className={`btn-rectangle-big-o ${this.state.patientRegister.taskName == '新增' ? '' : 'disabledBtn'}`} disabled={this.state.patientRegister.taskName == '新增' ? false : 'disabled'} onClick={() => {this.delPatient(this.state.patientId)}}>删除患者</button>
                                </Col>
                            </Row>
                            <span>仅当患者流程为“新增”时可以进行删除</span>
                        </div>
                    </Col>
                    <Col xl={19} lg={19} md={18} sm={16} xs={24}>
                        <div className="display-right">
                            <div className="whiteCard patientInfo">
                                <div className="title"><span></span>患者信息</div>
                                <Row>
                                    <Col span={24}>
                                        <div className="content"><span>患者来源：</span>{this.state.patientRegister.patientSourceName || '--'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者姓名：</span>{this.state.patientInfo.name}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者性别：</span>{this.state.patientInfo.sexName}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>出生日期：</span>{this.state.patientInfo.birthday || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者年龄：</span>{this.state.patientInfo.age || '--'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>身份证号：</span>{this.state.patientInfo.idCard || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>联系电话：</span>{this.state.patientInfo.contactPhone || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者职业：</span>{this.state.patientInfo.jobName || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>婚姻状况：</span>{this.state.patientInfo.marriedName || '--'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>付款方式：</span>{this.state.patientRegister.payTypeName || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>医保编号：</span>{this.state.patientRegister.medicalCard || '--'}</div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="whiteCard patientRegister">
                                <div className="title"><span></span>就诊信息</div>
                                <Row>
                                    <Col span={24}>
                                        <div className="content"><span>病人类型：</span>{this.state.patientRegister.patientTypeName || '--'}</div>
                                    </Col>
                                </Row>
                                {this.state.patientRegister.patientType == 1 ? (
                                    <div>
                                        <Row>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>门诊编号：</span>{this.state.patientRegister.hospitalNo || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>门诊科室：</span>{this.state.patientRegister.areaName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>门诊医生：</span>{this.state.patientRegister.doctorName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>就诊日期：</span>{this.state.patientRegister.registerTime || '--'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>申请医生：</span>{this.state.patientRegister.applyDoctorName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>申请日期：</span>{this.state.patientRegister.applyTime || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>放疗医生：</span>{this.state.patientRegister.radiotherapyDoctorName || '--'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>治疗技术：</span>{this.state.patientRegister.iatrotechniqueName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>诊断结果：</span>{this.state.patientRegister.treatResultName || '--'}</div>
                                            </Col>
                                        </Row>
                                    </div>
                                ) : (
                                    <div>
                                        <Row>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>住院编号：</span>{this.state.patientRegister.hospitalNo || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>住院病区：</span>{this.state.patientRegister.areaName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>主管医师：</span>{this.state.patientRegister.doctorName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>入院日期：</span>{this.state.patientRegister.registerTime || '--'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>申请医生：</span>{this.state.patientRegister.applyDoctorName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>申请日期：</span>{this.state.patientRegister.applyTime || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>放疗医生：</span>{this.state.patientRegister.radiotherapyDoctorName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>住院床号：</span>{this.state.patientRegister.bedNo || '--'}</div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>治疗技术：</span>{this.state.patientRegister.iatrotechniqueName || '--'}</div>
                                            </Col>
                                            <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                                <div className="content"><span>诊断结果：</span>{this.state.patientRegister.treatResultName || '--'}</div>
                                            </Col>
                                        </Row>
                                    </div>
                                )}
                            </div>
                            <div className="op-area">
                                <div className="btn-sm-solid" onClick={() => {this.gotoEdit(this.props.params.id)}}>编辑</div>
                            </div>
                            <div className="clearfix"></div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setTitle: subTitle
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(checkPatient);