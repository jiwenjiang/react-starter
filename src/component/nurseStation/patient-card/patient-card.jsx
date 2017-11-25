import React, {Component} from 'react';
import {Card, Row, Col} from 'antd';
import Moment from 'moment';
import NoData from '../../common/noData/index';
import {browserHistory} from 'react-router';
import StatusTag from '../../common/statusTag/statusTag';
import './patient-card.less';


class patientCard extends Component {
    constructor(props){
        super(props);
    }

    checkInto(id) {
        browserHistory.push(`/home/nurseStation/checkPatient/${id}`);
    }

    render(){
        return(
            <Row gutter={16}>
                {
                    this.props.data && this.props.data.length != 0 ? this.props.data.map((item, index) => {
                        return <Col className="gutter-row" xl={6} lg={8} md={12} sm={12} xs={24} key={index}>
                            <Card className="list-card">
                                <Row gutter={16}>
                                    <Col span={5}>
                                        <div className="display-left">
                                            <div className="photo-area">
                                                {
                                                    item.headImage ? <img src={item.headImage} /> : <i className="iconfont icon-geren-"></i>
                                                }
                                            </div>
                                            <div className="status-area">
                                                <StatusTag status={item.status} taskName={item.taskName} />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={19}>
                                        <div className="display-right">
                                            <Row>
                                                <div className="name">{item.name}</div>
                                                <div className="sexAge">（{item.sex}/{item.age}岁）</div>
                                                <div className="checkInto" onClick={() => {this.checkInto(item.id)}}><div className="text">查看详细</div><span className="iconfont icon-you"></span></div>
                                            </Row>
                                            <Row>
                                                <div className="tel text"><span className="title">联系电话：</span>{item.cellphone}</div>
                                            </Row>
                                            <Row>
                                                <Col span={14}>
                                                    <div className="area text"><span className="title">{item.patientType == 1 ? '门诊科室：' : '住院病区：'}</span>{item.areaName}</div>
                                                </Col>
                                                <Col span={10}>
                                                    <div className="doctor text"><span className="title">{item.patientType == 1 ? '门诊医生：' : '主管医师：'}</span>{item.doctorName}</div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={14}>
                                                    <div className="therapyDoctor text"><span className="title">放疗医生：</span>{item.radiotherapyDoctorName}</div>
                                                </Col>
                                                {item.patientType == 1 ? (<Col span={10} />) : (<Col span={10}>
                                                    <div className="bedNo text"><span className="title">住院床号：</span>{item.bedNo ? item.bedNo : '--'}</div>
                                                </Col>)}
                                            </Row>
                                            <Row>
                                                <Col span={10}>
                                                    <div className="registrant text"><span className="title">登记信息：</span>{item.createName}</div>
                                                </Col>
                                                <Col span={14}>
                                                    <div className="registTime text">{Moment(item.createTime).format('YYYY-MM-DD HH:mm')}</div>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                    }) : (<NoData></NoData>)
                }
            </Row>
        )
    }
}

export default patientCard;