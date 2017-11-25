import React, {Component} from 'react';
import {Modal, Row, Col, Table} from 'antd';
import {mouldTHead} from '_services/const/index';
import './index.less';

class MouldModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {visible, title, cancel, footer, width, confirm, html, infos} = this.props;
        const color = {'color': '#fd6520'};
        return (
            <Modal
                visible={visible}
                title={title}
                onCancel={cancel}
                width={width || 800}
                footer={footer}
            >
                <div className="mould-modal">
                    <div className="baseInfo">
                        <div className="patientInfo">
                            <Row>
                                <Col xs={8}>
                                    <div className="content">
                                        <span style={color}>*</span>
                                        <span className="title">患者姓名：</span>{infos&&infos.patientName}
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content">
                                        <span style={color}>*</span>
                                        <span className="title">患者性别：</span>{infos&&infos.patientSex}
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content">
                                        <span style={color}>*</span>
                                        <span className="title">患者年龄：</span>{infos&&infos.patientAge}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={8}>
                                    <div className="content organization">
                                        <span style={color}>*</span>
                                        <span className="title">申请科室：</span>{infos&&infos.applyOrganization}
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content">
                                        <span style={color}>*</span>
                                        <span className="title">申请医生：</span>{infos&&infos.applyDoctor}
                                    </div>
                                </Col>
                                <Col xs={8}>
                                    <div className="content">
                                        <span style={color}>*</span>
                                        <span className="title">联系电话：</span>{infos&&infos.patientPhone}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <div className="mouldTable">
                            <Table columns={mouldTHead} dataSource={infos&&infos.moudleDetails} rowKey={a => a.id}
                                   pagination={false}></Table>
                        </div>
                    </div>
                    {html}
                    <div className="op-area">
                        <div className="btn btn-ok" onClick={confirm}>确认</div>
                        <div className="btn btn-cancel" onClick={cancel}>取消</div>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </Modal>
        )
    }
}

export default MouldModal;