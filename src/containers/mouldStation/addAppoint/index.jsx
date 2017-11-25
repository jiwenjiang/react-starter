import React, {Component} from 'react';
import {Modal, Row, Col, Table, Select, DatePicker, Alert} from 'antd';
import Moment from 'moment';
import xhr from '_services/xhr/index';
import url from '_config/ip/mouldStation/mouldStation';
import {mouldTHead, mouldTimePeriod} from '_services/const/index';
import './addAppoint.less';

const Option = Select.Option;
class MouldAppoint extends Component {
    constructor(props){
        super(props);
        this.state = {
            patient: {},
            invalidAppoint: false,
            modifyData: {
                departmentId: null,
                beginDate: null,
                timePeriod: null
            },
            queuePeople: '-',
            lineNo: '--',
            isOrdered: false
        };
    }

    componentDidMount(){
        this.getInfo(this.props.patientId);
        this.getMouldRooms();
    }

    getInfo = (id) => {
        xhr.get(url.infoDetail, {id: id}, (data) => {
            if(data.lineNo == null){
                this.setState({
                    patient: data
                })
            }
            else{
                this.setState({
                    patient: data,
                    lineNo: data.lineNo,
                    queuePeople: data.appointmentPeople,
                    modifyData: {
                        departmentId: data.mouldRoomId.toString(),
                        beginDate: Moment(data.orderTime),
                        timePeriod: data.timePeriod
                    },
                    isOrdered: true
                })
            }
        })
    };

    getMouldRooms = () => {
        xhr.get(url.mouldRooms, {}, (data) => {
            let area = data.map(v => {
                return <Option key={v.id}>{v.name}</Option>
            });
            this.setState({
                area: area
            })
        })
    };

    // 修改时间
    pickTime = (v) => {
        this.setState({
            modifyData: {
                ...this.state.modifyData,
                beginDate: v
            }
        }, () => {
            if(this.state.modifyData.departmentId != null){
                this.mouldRoomInfo(this.state.modifyData);
            }
        });
    };
    // 修改科室
    chooseMould = (v) => {
        this.setState({
            modifyData: {
                ...this.state.modifyData,
                departmentId: v
            }
        }, () => {this.mouldRoomInfo(this.state.modifyData)});
    };
    // 修改时间段
    pickPeriod = (v) => {
        this.setState({
            modifyData: {
                ...this.state.modifyData,
                timePeriod: v
            }
        }, () => {
            if(this.state.modifyData.departmentId != null){
                this.mouldRoomInfo(this.state.modifyData);
            }
        });
    };
    mouldRoomInfo = (data) => {
        xhr.post(url.makeLineNo, {...data, prescriptionId: this.state.patient.id}, (data) => {
            this.setState({
                queuePeople: data.reservationNumber,
                lineNo: data.lineNo
            })
        })
    };
    onOk = () => {
        if(this.state.modifyData.departmentId == null || this.state.modifyData.beginDate == null || this.state.modifyData.timePeriod == null){
            this.setState({
                invalidAppoint: true
            })
        }
        else{
            xhr.post(url.appointment, {
                ...this.state.modifyData,
                lineNo: this.state.lineNo,
                prescriptionId: this.state.patient.id,
                radiotherapyNumber: this.state.patient.radiotherapyNumber
            }, () => {
                this.props.childSet({appointVisible: false})
            })
        }
    };
    onCancel = () => {
        this.props.childSet({appointVisible: false})
    };

    render() {
        const tHeads = mouldTHead;
        const [color, width] = [{'color': 'red'}, {'width': '200px', 'height': '34px'}];
        return (
            <Modal
                title="新增预约"
                visible={this.props.appointVisible}
                footer={null} width={600}
                onCancel={this.onCancel}
            >
                <div className="mould-modal">
                    <div className="baseInfo">
                        <div className="patientInfo">
                            <Row>
                                <Col xs={10}>
                                    <div className="content"><span style={color}>*</span><span className="title">患者姓名：</span>{this.state.patient.patientName || '--'}</div>
                                </Col>
                                <Col xs={6}>
                                    <div className="content"><span style={color}>*</span><span className="title">患者性别：</span>{this.state.patient.sex || '--'}</div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content"><span style={color}>*</span><span className="title">患者年龄：</span>{this.state.patient.age || '--'}</div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={10}>
                                    <div className="content organization"><span style={color}>*</span><span className="title">申请科室：</span>{this.state.patient.areaName || '--'}</div>
                                </Col>
                                <Col xs={6}>
                                    <div className="content doctorName"><span style={color}>*</span><span className="title">申请医生：</span>{this.state.patient.radiotherapyDoctorName || '--'}</div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content"><span style={color}>*</span><span className="title">联系电话：</span>{this.state.patient.cellphone || '--'}</div>
                                </Col>
                            </Row>
                        </div>
                        <div className="mouldTable">
                            <Table columns={tHeads} dataSource={this.state.patient.moudleDetails} rowKey={a => a.id} pagination={false}></Table>
                        </div>
                    </div>
                    <span className="divider"></span>
                    <div className="addAppoint">
                        <Row>
                            <Col xs={12}>
                                <div>
                                    <span style={color}>*</span>
                                    <span className="title">做模选择：</span>
                                    <Select style={width} size="large" disabled={this.state.isOrdered} onChange={this.chooseMould}
                                            value={this.state.modifyData.departmentId}>
                                        {this.state.area}
                                    </Select>
                                </div>
                            </Col>
                        </Row>
                        <Row className='mg-top20'>
                            <Col xs={12}>
                                <div>
                                    <span style={color}>*</span>
                                    <span className="title">预约日期：</span>
                                    <DatePicker style={width} size="large" disabled={this.state.isOrdered} onChange={this.pickTime} value={this.state.modifyData.beginDate}/>
                                </div>
                            </Col>
                        </Row>
                        <Row className='mg-top20'>
                            <Col xs={12}>
                                <div>
                                    <span style={color}>*</span>
                                    <span className="title">选择时段：</span>
                                    <Select style={width} size="large" disabled={this.state.isOrdered} value={this.state.modifyData.timePeriod}
                                            onChange={this.pickPeriod}>
                                        {mouldTimePeriod}
                                    </Select>
                                </div>
                            </Col>
                            <Col xs={6}>
                                <span className="title">预约人数：&nbsp;{this.state.queuePeople}人</span>
                            </Col>
                            <Col xs={6}>
                                <span className="title">排号：&nbsp;{this.state.lineNo}</span>
                            </Col>
                        </Row>
                        <Row className="mg-top20">
                            {this.state.invalidAppoint ? (<Alert message="请填写完整的预约信息" type="warning" showIcon/>) : ''}
                        </Row>
                    </div>
                    <div className="op-area">
                        {this.state.isOrdered ? '' : (<div className="btn btn-ok" onClick={this.onOk}>确认</div>)}
                        <div className="btn btn-cancel" onClick={this.onCancel}>取消</div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </Modal>
        )
    }
}

export default MouldAppoint;