import React, {Component} from 'react';
import {Card, Row, Col, Icon, Menu, Dropdown} from 'antd';
import Moment from 'moment';
import {browserHistory} from 'react-router';
import NoData from '../../common/noData/index';
import MouldDone from '../mould-done/mould-done';
import MouldArrive from '../mould-arrive/mould-arrive';
import MouldError from '../mould-error/mould-error';
import MouldAppoint from '_containers/mouldStation/addAppoint';
import MouldStatusTag from '../../common/mouldStatusTag/mouldStatusTag';
import './mould-card.less';


class mouldCard extends Component {
    constructor(props){
        super(props);
        this.state = {
            doneVisible: false,
            arriveVisible: false,
            errorVisible: false,
            appointVisible: false
        }
    }

    checkInto(id) {
        browserHistory.push(`/home/mouldStation/mouldInfo/${id}`);
    }

    mouldArrive = (id) => {
        this.setState({
            arriveVisible: true,
            patientId: id
        })
    };

    mouldDone = (id) => {
        this.setState({
            doneVisible: true,
            patientId: id
        })
    };

    mouldError = (id) => {
        this.setState({
            errorVisible: true,
            patientId: id
        })
    };

    mouldAppoint = (id) => {
        this.setState({
            appointVisible: true,
            patientId: id
        })
    };

    mould = (id, e) => {
        if(e.key == 'error'){
            this.mouldError(id);
        }
        else{
            this.mouldAppoint(id);
        }
    };

    childSet = (obj) => {
        this.setState({
            ...obj
        }, () => {
            this.props.getList(this.props.params);
        })
    };

    render(){
        return(
            <Row gutter={16}>
                {
                    this.props.data && this.props.data.length != 0 ? this.props.data.map((item, index) => {
                        return <Col className="gutter-row" xl={6} lg={8} md={12} sm={12} xs={24} key={index}>
                            <Card className="mould-card">
                                <Row>
                                    <Col span={5}>
                                        <div className="display-left">
                                            <div className="photo-area">
                                                {
                                                    item.headImage ? <img src={item.headImage} /> : <i className="iconfont icon-geren-"></i>
                                                }
                                            </div>
                                            <div className="status-area">
                                                <MouldStatusTag status={item.status}/>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={19}>
                                        <div className="display-right">
                                            <Row>
                                                <div className="name">{item.patientName}</div>
                                                <div className="sexAge">（{item.sex}/{item.age}岁）</div>
                                                <div className="checkInto" onClick={() => this.checkInto(item.id)}><div className="text">查看详细</div><span className="iconfont icon-you"></span></div>
                                            </Row>
                                            <Row>
                                                <div className="tel text"><span className="title">联系电话：</span>{item.cellphone}</div>
                                            </Row>
                                            <Row>
                                                <div className="area text"><span className="title">申请科室：</span>{`${item.areaName} ${item.radiotherapyDoctorName}(${item.payStatus == 1 ? '已划价' : '未划价'})`}</div>
                                            </Row>
                                            <Row>
                                                <div className="applyTime text"><span className="title">申请时间：</span>{Moment(item.applyTime).format('YYYY-MM-DD HH:mm')}</div>
                                            </Row>
                                            <Row>
                                                <div className="orderTime text"><span className="title">预约时间：</span>{item.orderTime ? `${Moment(item.orderTime).format('YYYY-MM-DD')} ${item.timePeriod}` : '--'}</div>
                                            </Row>
                                            <Row>
                                                <div className="mouldTime text"><span className="title">做模时间：</span>{item.finishTime ? `${Moment(item.finishTime).format('YYYY-MM-DD HH:mm')} ${item.moldTechnologist}` : '--'}</div>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className="op-area">
                                        {item.status == 1 ? (
                                            <Row>
                                                <Col span={12}>
                                                    <div className="op-btn" onClick={() => this.mouldArrive(item.id)}>到达</div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="op-btn"><Dropdown overlay={(<Menu onClick={this.mould.bind(this, item.id)}>
                                                        <Menu.Item key="appoint">预约做模</Menu.Item>
                                                        <Menu.Item key="error">数据异常</Menu.Item>
                                                    </Menu>)} placement="topLeft">
                                                        <a href="#" className="ant-dropdown-link">更多操作 <Icon type="up"/></a>
                                                    </Dropdown></div>
                                                </Col>
                                            </Row>
                                        ) : (item.status == 2 ? (
                                            <Row>
                                                <Col span={12}>
                                                    <div className="op-btn" onClick={() => this.mouldDone(item.id)}>完成</div>
                                                </Col>
                                                <Col span={12}>
                                                    <div className="op-btn" onClick={() => this.mouldError(item.id)}>异常</div>
                                                </Col>
                                            </Row>
                                        ) : (
                                            <Row></Row>
                                        ))}
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    }) : (<NoData></NoData>)
                }
                {this.state.doneVisible ? <MouldDone doneVisible={this.state.doneVisible} childSet={this.childSet.bind(this)} patientId={this.state.patientId}/> : ''}
                {this.state.arriveVisible? <MouldArrive arriveVisible={this.state.arriveVisible} childSet={this.childSet.bind(this)} patientId={this.state.patientId}/> : ''}
                {this.state.errorVisible ? <MouldError errorVisible={this.state.errorVisible} childSet={this.childSet.bind(this)} patientId={this.state.patientId}/> : ''}
                {this.state.appointVisible ? <MouldAppoint appointVisible={this.state.appointVisible} childSet={this.childSet.bind(this)} patientId={this.state.patientId}/> : ''}
            </Row>
        )
    }
}

export default mouldCard;