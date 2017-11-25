import React, {Component} from 'react';
import {Modal, Row, Col, Table, Select} from 'antd';
import xhr from '_services/xhr/index';
import url from '_config/ip/mouldStation/mouldStation';
import {mouldTHead} from '_services/const/index';
import '../mould-done/mould-done.less';
import './mould-arrive.less';

const Option = Select.Option;
class MouldArrive extends Component {
    constructor(props){
        super(props);
        this.state = {
            patient: {},
            area: [],
            queuePeople: '-',
            lineNo: '--'
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
                    mouldRoom: data.mouldRoomId.toString(),
                    lineNo: data.lineNo,
                    queuePeople: data.queuePeople
                });
            }
            this.isOrdered(data.lineNo);
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

    chooseMouldRoom = (value) => {
        this.setState({
            mouldRoom: value
        }, () => {this.mouldRoomInfo(value)})
    };

    mouldRoomInfo = (id) => {
        xhr.post(url.makeLineNo, {departmentId: id, prescriptionId: this.state.patient.id}, (data) => {
            this.setState({
                queuePeople: data.queuePeople,
                lineNo: data.lineNo
            })
        })
    };

    isOrdered = (lineNo) => {
        if(lineNo){
            this.setState({
                isOrdered: true
            })
        }
        else{
            this.setState({
                isOrdered: false
            })
        }
    };

    onOk = () => {
        xhr.put(url.arrive, {prescriptionId: this.state.patient.id, departmentId: this.state.mouldRoom, lineNo: this.state.lineNo}, () => {
            this.props.childSet({arriveVisible: false})
        });
    };
    onCancel = () => {
        this.props.childSet({arriveVisible: false})
    };

    render() {
        const tHeads = mouldTHead;
        const color = {'color': 'red'};
        return (
            <Modal
                title="患者到达"
                visible={this.props.arriveVisible}
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
                    <div className="arrive">
                        <div className="mould-room">
                            <span style={color}>*</span><span className="title">做模选择：</span>
                            <Select size="large" style={{width: 202}} value={this.state.mouldRoom} onSelect={this.chooseMouldRoom} disabled={this.state.isOrdered ? true : false}>{this.state.area}</Select>
                        </div>
                        <div className="mould-room">
                            <span className="title">排队人数：</span><span>{`${this.state.queuePeople}人`}</span>
                        </div>
                        <div className="mould-room">
                            <span className="title">排号：</span><span>{this.state.lineNo}</span>
                        </div>
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

export default MouldArrive;