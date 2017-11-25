import React, {Component} from 'react';
import {Modal, Row, Col, Table, Checkbox, Input, Alert} from 'antd';
import xhr from '_services/xhr/index';
import url from '_config/ip/mouldStation/mouldStation';
import {mouldTHead} from '_services/const/index';
import '../mould-done/mould-done.less';
import './mould-error.less';

const CheckboxGroup = Checkbox.Group;
const TextArea = Input.TextArea;

function onChange(a) {
    console.log(a)
}
class MouldError extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reasons: [],
            showTextarea: false,
            patient: {},
            checkedReasons: '',
            content: '',
            invalidText: false,
            invalidReasons: false
        }
    }

    componentDidMount() {
        this.getReasons();
        this.getInfo(this.props.patientId);
    }

    getReasons = () => {
        xhr.get(url.dictionary, {type: 'mould_exception'}, (data) => {
            let reasons = data.map(v => {
                return {label: v.bdName, value: v.id}
            });
            this.setState({reasons: reasons})
        })
    };

    getInfo = (id) => {
        xhr.get(url.infoDetail, {id: id}, (data) => {
            this.setState({
                patient: data
            })
        })
    };

    chooseReasons = (checkedReasons) => {
        this.setState({
            checkedReasons: checkedReasons
        })
    };

    chooseOther = (e) => {
        if(e.target.checked){
            this.setState({
                showTextarea: true
            })
        }
        else{
            this.setState({
                showTextarea: false
            })
        }
    };

    inputContent = (e) => {
        this.setState({
            content: e.target.value,
            invalidText: false,
            invalidReasons: false
        })
    };

    onOk = () => {
        if(this.state.showTextarea && this.state.content.length == 0){
            this.setState({
                invalidText: true,
                invalidReasons: false
            });
            return;
        }
        if(!this.state.showTextarea && this.state.checkedReasons.length == 0){
            this.setState({
                invalidReasons: true,
                invalidText: false
            });
            return;
        }
        let param = {
            content: this.state.content,
            infoType: this.state.checkedReasons.toString(),
            prescriptionId: this.state.patient.id,
            taskId: this.state.patient.taskId
        };
        xhr.post(url.addError, param, () => {
            this.props.childSet({errorVisible: false})
        });
    };
    onCancel = () => {
        this.props.childSet({errorVisible: false})
    };

    render() {
        const color = {'color': 'red'};
        const tHeads = mouldTHead;
        return (
            <Modal
                title="异常状态"
                visible={this.props.errorVisible}
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
                    <div className="error">
                        <Row gutter={8}>
                            <Col span={4}>
                                <div className="title">
                                    <span style={color}>*</span><span
                                    style={{fontWeight: 'bold'}}>异常原因：</span>
                                </div>
                            </Col>
                            <Col span={20}>
                                <div className="options">
                                    <CheckboxGroup onChange={this.chooseReasons}>
                                        <Row>
                                            {this.state.reasons.length != 0 && this.state.reasons.map(v => {
                                                return <Col span={8} key={v.value} style={{marginBottom: 17}}><Checkbox onChange={onChange}
                                                    value={v.value}>{v.label}</Checkbox></Col>
                                            })}
                                        </Row>
                                    </CheckboxGroup>
                                    <Row>
                                        <Col span={8}><Checkbox onChange={this.chooseOther}>其他</Checkbox></Col>
                                    </Row>
                                    {this.state.showTextarea == true ? (
                                        <Row>
                                            <Col span={24}>
                                                <TextArea value={this.state.content} onChange={this.inputContent} placeholder="请描述异常原因" style={{'resize': 'none', marginTop: 10}} maxLength="100" autosize={{maxRows: 6}}/>
                                            </Col>
                                        </Row>
                                    ) : (<Row></Row>)}
                                </div>
                            </Col>
                        </Row>
                        {this.state.invalidText ? (<Alert message="请描述异常原因" type="warning" showIcon style={{marginTop: 20}}/>) : ''}
                        {this.state.invalidReasons ? (<Alert message="请选择异常原因" type="warning" showIcon style={{marginTop: 20}}/>) : ''}
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

export default MouldError;