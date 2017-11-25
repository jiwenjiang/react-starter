import React, {Component} from 'react';
import {Table, Row, Col} from 'antd';
import Moment from 'moment';
import NoData from '../../common/noData';
import {browserHistory} from 'react-router'
import './patient-table.less';

class patientTable extends Component {
    constructor(props) {
        super(props);
    }

    checkInto(id) {
        browserHistory.push(`/home/nurseStation/checkPatient/${id}`);
    }

    render = () => {
        let data = this.props.data;
        const status = {
            '进行中': 'process',
            '异常': 'abnormal',
            '结束': 'end'
        };
        const tHeads = [
            {
                title: '当前流程',
                dataIndex: 'taskName',
                key: 'taskName',
                render: (text, record) => {
                    return (
                        <span className={status[record.status]}><span className="point"></span>{record.taskName}</span>
                    )
                }
            },
            {
                title: '姓名/性别/年龄',
                key: 'info',
                render: (text, record) => {
                    return (
                        <span>
                        {record.name}/{record.sex}/{record.age}岁
                    </span>
                    )
                }
            },
            {
                title: '联系电话',
                dataIndex: 'cellphone',
                key: 'cellphone'
            },
            {
                title: '病人类型',
                dataIndex: 'patientType',
                key: 'patientType',
                render: (text, record) => {
                    return (
                        <span>{record.patientType == 1 ? '门诊' : '住院'}</span>
                    )
                }
            },
            {
                title: '门诊科室/住院病区',
                dataIndex: 'areaName',
                key: 'areaName'
            },
            {
                title: '门诊医生/主管医生',
                dataIndex: 'doctorName',
                key: 'doctorName'
            },
            {
                title: '住院床号',
                dataIndex: 'bedNo',
                key: 'bedNo',
                render: (text, record) => {
                    return (
                        <span>{record.bedNo ? record.bedNo : '--'}</span>
                    )
                }
            },
            {
                title: '放疗医生',
                dataIndex: 'radiotherapyDoctorName',
                key: 'radiotherapyDoctorName'
            },
            {
                title: '登记信息',
                key: 'registInfo',
                render: (text, record) => {
                    return (
                        <span>
                        {`${record.createName}   ${Moment(record.createTime).format('YYYY-MM-DD HH:mm')}`}
                    </span>
                    )
                }
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <a style={{'color': '#408ee6'}} onClick={() => this.checkInto(record.id)}>查看</a>
                    </span>
                )
            }
        ];
        // let dataSource = this.props.data.map(v => {
        //     let obj
        // });

        return (
            <Row className="patientTable">
                <Col span={24}>
                    {this.props.data && this.props.data.length != 0 ? (
                        <Table columns={tHeads} dataSource={data} rowKey={a => a.id} pagination={false}></Table>
                    ) : (
                        <NoData></NoData>
                    )}

                </Col>
            </Row>
        )
    }
}

export default patientTable;