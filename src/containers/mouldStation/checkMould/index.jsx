import React, {Component} from 'react';
import {Col, Row, Table} from 'antd';
import Moment from 'moment';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import '../../../assets/fonts/iconfont.css';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import {mouldTHead} from '_services/const/index';
import MouldStatusTag from '_component/common/mouldStatusTag/mouldStatusTag';
import url from '_config/ip/mouldStation/mouldStation';
import xhr from '_services/xhr/index';
import './checkMould.less';

class checkMould extends Component {
    constructor(props){
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            patientId: this.props.params.id,
            patient: {}
        }
    }

    componentDidMount(){
        const titles = [
            {link: '/home/mouldStation/mouldList', text: '做模列表'},
            {link: `/home/mouldStation/mouldInfo/${this.state.patientId}`, text: '患者详情'}
        ];
        this.props.setTitle(titles);
        this.getInfo(this.state.patientId);
    }

    getInfo = (id) => {
        xhr.get(url.infoDetail, {id: id}, (data) => {
            this.setState({
                patient: data
            })
        })
    };

    imgError = () => {
        this.setState({
            patient: {
                ...this.state.patient,
                headImage: null
            }
        });
    };

    render() {
        const tHeads = mouldTHead;
        return (
            <div className="checkMould">
                <Row gutter={16}>
                    <Col xl={5} lg={5} md={6} sm={8} xs={24}>
                        <div className="display-left">
                            <div className="photo-area">
                                {this.state.patient.headImage ? <img src={this.state.patient.headImage} onError={this.imgError} /> : <i className="iconfont icon-geren-"></i>}
                            </div>
                            <div className="name">{this.state.patient.patientName || '--'}</div>
                            <MouldStatusTag status={this.state.patient.status}/>
                            <div className="text"><span>放疗编号：</span>{this.state.patient.radiotherapyNumber || '--'}</div>
                        </div>
                    </Col>
                    <Col xl={19} lg={19} md={18} sm={16} xs={24}>
                        <div className="display-right">
                            <div className="whiteCard patientInfo">
                                <div className="title"><span></span>患者信息</div>
                                <Row>
                                    <Col span={24}>
                                        <div className="content"><span>患者来源：</span>{this.state.patient.patientSource == '1' ? '本院' : '外院'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者姓名：</span>{this.state.patient.patientName}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者性别：</span>{this.state.patient.sex}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>出生日期：</span>{this.state.patient.birthday || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者年龄：</span>{this.state.patient.age || '--'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>身份证号：</span>{this.state.patient.idCard || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>联系电话：</span>{this.state.patient.cellphone || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>患者职业：</span>{this.state.patient.job || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>婚姻状况：</span>{this.state.patient.isMarried || '--'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>付款方式：</span>{this.state.patient.payClass || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>医保编号：</span>{this.state.patient.medicalCard || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>申请科室：</span>{this.state.patient.areaName || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>放疗医生：</span>{this.state.patient.radiotherapyDoctorName || '--'}</div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>划价状态：</span>{this.state.patient.payStatus == '0' ? '未划价' : '已划价'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>申请时间：</span>{Moment(this.state.patient.applyTime).format('YYYY-MM-DD HH:mm') || '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>预约时间：</span>{this.state.patient.orderTime ? `${Moment(this.state.patient.orderTime).format('YYYY-MM-DD')} ${this.state.patient.timePeriod}` : '--'}</div>
                                    </Col>
                                    <Col xl={6} lg={6} md={8} sm={12} xs={12}>
                                        <div className="content"><span>做模医师：</span>{this.state.patient.moldTechnologist || '--'}</div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="whiteCard patientRegister">
                                <div className="title"><span></span>模具信息</div>
                                <Row>
                                    <Table columns={tHeads} dataSource={this.state.patient.moudleDetails} rowKey={a => a.id} pagination={false}></Table>
                                </Row>
                            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(checkMould);