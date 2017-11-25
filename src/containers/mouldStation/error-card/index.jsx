import React, {Component} from 'react';
import {Card, Row, Col, Tooltip} from 'antd';
import NoData from '_component/common/noData/index';
import ErrorStatusTag from '_component/common/errorStatusTag/errorStatusTag';
import './error-card.less';


class errorCard extends Component {
    constructor(props){
        super(props);
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
                                        </div>
                                    </Col>
                                    <Col span={19}>
                                        <div className="display-right">
                                            <Row>
                                                <div className="name">{item.patientName}</div>
                                                <div className="sexAge">（{item.sex}/{item.age}岁）</div>
                                                {/*<div className="checkInto" onClick={() => {this.checkInto(item.id)}}><div className="text">查看详细</div><span className="iconfont icon-you"></span></div>*/}
                                            </Row>
                                            <Row>
                                                <div className="tel text"><span>联系电话：</span>{item.cellphone || '--'}</div>
                                            </Row>
                                            <Row>
                                                <div className="tel text"><span>申请科室：</span>{`${item.areaName} ${item.radiotherapyDoctorName} (${item.payStatus == 1 ? '已划价' : '未划价'})`}</div>
                                            </Row>
                                        </div>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col span={5}>
                                        <div className="display-left">
                                            <div className="status-area">
                                                <ErrorStatusTag status={item.status}/>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col span={19}>
                                        <div className="display-right">
                                            <Row>
                                                <Col span={24}>
                                                    <div className="therapyDoctor text"><span className="title">异常原因：</span>
                                                        <Tooltip title={item.handleResult.length == 0 ? '无' : item.handleResult}>
                                                            <span className="errorReason">{item.handleResult}</span>
                                                        </Tooltip>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24}>
                                                    <div className="registrant text"><span className="title">处理结果：</span>
                                                        <Tooltip title={item.feedbackResult == null ? '无' : item.feedbackResult}>
                                                            <span className="errorReason">{item.feedbackResult == null ? '--' : item.feedbackResult}</span>
                                                        </Tooltip>
                                                    </div>
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

export default errorCard;