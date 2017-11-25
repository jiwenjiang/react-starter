import React, {Component} from 'react';
import {Row, Col, Select, DatePicker, Input} from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import SortTable from '_component/mouldStation/mould-sort';
import ModalTable from '_component/common/modalTable';
import MouldModal from '_component/mouldStation/mould-modal';
import {mouldTimePeriod} from '_services/const';
import url from '_config/ip/mouldStation/mouldStation';
import xhr from '_services/xhr/index';
import './index.less';

const [Option, Search] = [Select.Option, Input.Search];


class Mouldsort extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.startTime = moment().day(1).format('YYYY-MM-DD');
        this.endTime = moment().day(7).format('YYYY-MM-DD');
        this.curWeek = `${moment(this.startTime).format('YYYY.MM.DD')}-${moment(this.endTime).format('MM.DD')}`;
        this.headList = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        this.state = {
            curWeek: this.curWeek,
            modalTable: {
                visible: false,
                title: null
            },
            mouldModal: {
                visible: false,
                title: null
            },
            modifyData: {
                beginDate: null,
                timePeriod: null,
                departmentId: null
            }
        }
    }

    componentDidMount() {
        this.columns = [{
            title: '姓名/性别/年龄',
            dataIndex: 'info',
            width: '30%',
            render: (text, obj) => <span>{obj.patientName}/{obj.patientSex}/{obj.patientAge}</span>
        }, {
            title: '预约时段',
            width: '30%',
            dataIndex: 'appointmentTime'
        }, {
            title: '申请医生',
            width: '30%',
            dataIndex: 'applyDoctor'
        }, {
            title: '操作',
            width: '6%',
            dataIndex: 'action',
            render: (text, obj) => <span onClick={() => this.updateSort(obj)}
                                         style={{
                                             width: '100%',
                                             height: '100%',
                                             display: 'inline-block',
                                             textAlign: 'center'
                                         }}>更改</span>
        }];
        this.getList();
        this.getRooms();
    }

    // 获取日历列表
    getList(e) {
        xhr.get(url.sortList, {fDate: this.startTime, oDate: this.endTime, keyWord: e}, (data) => {
            const firstTr = data.reservations && data.reservations.map((v, i) => {
                    return <div key={i}>
                        <p>上午<span> {v.morning} </span>人</p>
                        <p>下午<span> {v.afternoon} </span>人</p>
                    </div>
                })
            const listTr = data.list && data.list.map((v1, i1) => {
                    return <div key={i1} className="listTr">
                        <div>{v1.timePeriod}</div>
                        {v1.list && v1.list.map((v2, i2) => {
                            return <div key={i2}>{
                                v2.modelInfo && v2.modelInfo.map((v3, i3) => {
                                    return (i3 < v2.modelInfo.length - 1 || i3 < 5)
                                        ? <span key={i3} onClick={() => this.updateSort(v3)}>{v3.patientName}</span>
                                        : <span key={i3}
                                                onClick={() => this.openList(v2.modelInfo)}>{`· · · (${v2.modelInfo.length})`}</span>
                                })
                            }</div>
                        })
                        }
                    </div>
                })
            const datas = {
                firstTr,
                listTr
            }
            this.setState({
                datas,
                curWeek: this.curWeek
            })
        })
    }

    // 修改查询日期
    changeList(v) {
        this.startTime = moment(this.startTime).add(v, 'days').format('YYYY-MM-DD');
        this.endTime = moment(this.endTime).add(v, 'days').format('YYYY-MM-DD');
        this.curWeek = `${moment(this.startTime).format('YYYY.MM.DD')}-${moment(this.endTime).format('MM.DD')}`;
        this.getList();
    }

    // 获取模具科室
    getRooms() {
        xhr.get(url.mouldRooms, '', (data) => {
            this.mouldRoom = data && data.map((v) => <Option key={v.id.toString()}>{v.name}</Option>)
            this.initHtml();
        })
    }

    disabledDate(v) {
        return v && v.valueOf() < moment().subtract(1, 'days');
    }

    // 修改模具HTML
    initHtml() {
        const [color, width] = [{'color': '#fd6520'}, {'width': '200px'}];
        this.html = <div className='mouldHtml'>
            <Row>
                <Col xs={12}>
                    <div>
                        <span style={color}>*</span>
                        <span>做模选择：</span>
                        <Select style={width} onChange={this.chooseMould}
                                value={this.state.modifyData.departmentId}>
                            {this.mouldRoom}
                        </Select>
                    </div>
                </Col>
            </Row>
            <Row className='mg-top20'>
                <Col xs={12}>
                    <div>
                        <span style={color}>*</span>
                        <span>预约日期：</span>
                        <DatePicker style={width} disabledDate={this.disabledDate} onChange={this.pickTime}
                                    value={this.state.modifyData.beginDate}/>
                    </div>
                </Col>
            </Row>
            <Row className='mg-top20'>
                <Col xs={12}>
                    <div>
                        <span style={color}>*</span>
                        <span>选择时段：</span>
                        <Select style={width} value={this.state.modifyData.timePeriod}
                                onChange={this.pickPeriod}>
                            {mouldTimePeriod}
                        </Select>
                    </div>
                </Col>
                <Col xs={6}>
                    <span>预约人数：&nbsp;{this.state.personNum}人</span>
                </Col>
                <Col xs={6}>
                    <span>排号：&nbsp;{this.state.lineNo}</span>
                </Col>
            </Row>
        </div>
        this.forceUpdate();
    }

    // 一个时间节点的排队列表
    openList(list) {
        this.setState({
            modalTable: {
                visible: true,
                title: '患者列表',
                footer: null,
                rowKey: 'prescriptionId'
            },
            modalData: list
        });
    }

    // 个人修改弹窗
    updateSort(v) {
        this.setState({
            modalTable: {
                visible: false
            },
            mouldModal: {
                visible: true,
                title: '预约修改'
            },
            infos: v,
            modifyData: {
                beginDate: moment(v.beginTime),
                timePeriod: v.timePeriod.toString(),
                departmentId: v.departmentdId.toString(),
                id: v.id
            },
            personNum: v.appointmentPeople,
            lineNo: v.lineNo
        }, () => this.initHtml());
    }

    tableCancel() {
        this.setState({
            modalTable: {
                visible: false
            }
        });
    }

    mouldCancel() {
        this.setState({
            mouldModal: {
                visible: false
            }
        });
    }

    // 确认修改
    confirm() {
        xhr.put(url.appointment, this.state.modifyData, () => {
            this.mouldCancel();
            this.getList();
        })
    }

    childSet = (data) => {
        this.setState({
            data
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
            this.mouldRoomInfo(this.state.modifyData);
        });
    }
    // 修改科室
    chooseMould = (v) => {
        this.setState({
            modifyData: {
                ...this.state.modifyData,
                departmentId: v
            }
        }, () => {
            this.mouldRoomInfo(this.state.modifyData);
        });
    }
    // 修改时间段
    pickPeriod = (v) => {
        this.setState({
            modifyData: {
                ...this.state.modifyData,
                timePeriod: v
            }
        }, () => {
            this.mouldRoomInfo(this.state.modifyData);
        });
    }

    mouldRoomInfo = (data) => {
        xhr.post(url.makeLineNo, {...data, prescriptionId: this.state.infos.id}, (data) => {
            this.setState({
                personNum: data.reservationNumber,
                lineNo: data.lineNo
            }, () => {
                this.initHtml();
            })
        })
    };

    render() {
        const {datas, curWeek, infos} = this.state;
        const head = this.headList.map((v, i) => {
            return <div key={i}>{v}</div>
        })
        return (
            <div className="mould-sort">
                <p>
                    <button className="lm-circleBtn-opcity mr-10" onClick={() => this.changeList(-7)}>查看上周</button>
                    <button className="lm-circleBtn-opcity mr-20" onClick={() => this.changeList(7)}>查看下周</button>
                    <span className="time">{curWeek}</span>
                    <Search className="search" size='large' placeholder="姓名/电话/放疗号搜索..."
                            onSearch={(e) => this.getList(e)} style={{width: 200}}/>
                </p>
                <div className="sort-box">
                    <SortTable head={head} datas={datas}></SortTable>
                </div>
                <ModalTable {...this.state.modalTable} columns={this.columns} pagenation={false}
                            cancel={() => this.tableCancel()} dataSource={this.state.modalData}></ModalTable>
                <MouldModal {...this.state.mouldModal} cancel={() => this.mouldCancel()} infos={infos}
                            confirm={() => this.confirm()} html={this.html}></MouldModal>
            </div>
        )
    }
}

export default Mouldsort;