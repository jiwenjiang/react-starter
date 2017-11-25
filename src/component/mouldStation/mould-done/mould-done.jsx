import React, {Component} from 'react';
import {Modal, Row, Col, Table} from 'antd';
import Moment from 'moment';
import xhr from '_services/xhr/index';
import url from '_config/ip/mouldStation/mouldStation';
import {mouldTHead} from '_services/const/index';
import './mould-done.less';

class MouldDone extends Component {
    constructor(props){
        super(props);
        this.state = {
            patient: {}
        };
    }

    componentDidMount(){
        this.getInfo(this.props.patientId);
    }

    getInfo = (id) => {
        xhr.get(url.infoDetail, {id: id}, (data) => {
            this.setState({
                patient: data
            })
        })
    };

    onOk = () => {
        xhr.put(url.done, {prescriptionId: this.state.patient.id, taskId: this.state.patient.taskId}, () => {
            this.props.childSet({doneVisible: false})
        });
    };
    onCancel = () => {
        this.props.childSet({doneVisible: false})
    };

    render() {
        const tHeads = mouldTHead;
        return (
            <Modal
                title="确认完成"
                visible={this.props.doneVisible}
                footer={null} width={600}
                onCancel={this.onCancel}
            >
                <div className="mould-modal">
                    <div className="baseInfo">
                        <div className="patientInfo">
                            <Row>
                                <Col xs={10}>
                                    <div className="content"><span style={{'color': 'red'}}>*</span><span className="title">患者姓名：</span>{this.state.patient.patientName || '--'}</div>
                                </Col>
                                <Col xs={6}>
                                    <div className="content"><span style={{'color': 'red'}}>*</span><span className="title">患者性别：</span>{this.state.patient.sex || '--'}</div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content"><span style={{'color': 'red'}}>*</span><span className="title">患者年龄：</span>{this.state.patient.age || '--'}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10}>
                                    <div className="content organization"><span style={{'color': 'red'}}>*</span><span className="title">申请科室：</span>{this.state.patient.areaName || '--'}</div>
                                </Col>
                                <Col xs={6}>
                                    <div className="content doctorName"><span style={{'color': 'red'}}>*</span><span className="title">申请医生：</span>{this.state.patient.radiotherapyDoctorName || '--'}</div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content"><span style={{'color': 'red'}}>*</span><span className="title">联系电话：</span>{this.state.patient.cellphone || '--'}</div>
                                </Col>
                            </Row>
                        </div>
                        <div className="mouldTable">
                            <Table columns={tHeads} dataSource={this.state.patient.moudleDetails} rowKey={a => a.id} pagination={false}></Table>
                        </div>
                    </div>
                    <span className="divider"></span>
                    <div className="curTime">
                        <span>完成时间：</span>{Moment().format('YYYY-MM-DD HH:mm')}
                    </div>
                    <div className="op-area">
                        <div className="btn btn-ok" onClick={this.onOk}>确认</div>
                        <div className="btn btn-cancel" onClick={this.onCancel}>取消</div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </Modal>
        )
    }
}

export default MouldDone;