import React, {Component} from 'react';
import {Input, Select, Row, Col, Table, Pagination} from 'antd';
import Moment from 'moment';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import url from '_config/ip/mouldStation/mouldStation';
import xhr from '_services/xhr/index';
import './index.less';

const [Option, Search] = [Select.Option, Input.Search];

class queue extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            size: 'large',
            queueInfo: {},
            params: {
                pageSize: 20,
                pageNum: 1,
                current: 1,
                today: Moment().format('YYYY-MM-DD')
            },
            data: []
        };
    }

    componentDidMount() {
        const titles = [
            {link: '/home/mouldStation/queue', text: '排队叫号'},
        ];
        const style = {
            width: '50%',
            height: '100%',
            display: 'inline-block',
            textAlign: 'center'
        }
        this.tHeads = [
            {
                title: '状态',
                dataIndex: 'status',
                render: (text) => <span>{text == 5 ? '暂停' : (text == 6 ? '已叫号' : '未叫号')}</span>
            },
            {
                title: '排队号',
                dataIndex: 'lineNo',
                render: (text) => <span>{text ? text : '--'}</span>
            },
            {
                title: '患者姓名',
                dataIndex: 'patientName',
                render: (text) => <span>{text ? text : '--'}</span>
            },
            {
                title: '患者性别',
                dataIndex: 'sex',
                render: (text) => <span>{text ? text : '--'}</span>
            },
            {
                title: '患者年龄',
                dataIndex: 'age',
                render: (text) => <span>{text ? text : '--'}</span>
            },
            {
                title: '做模室',
                dataIndex: 'departmentName',
                render: (text) => <span>{text ? text : '--'}</span>
            },
            {
                title: '放疗号',
                dataIndex: 'patientNo',
                render: (text) => <span>{text ? text : '--'}</span>
            },
            {
                title: '操作',
                key: 'stop',
                render: (record) =>
                    <div>
                        <span style={style} onClick={() => this.toQueue(record)}>叫号</span>
                        <span style={style}
                              onClick={() => this.stop(record)}>{record.status == 5 ? '激活' : '暂停'}</span>
                    </div>
            }
        ]
        this.props.setTitle(titles);
        this.getMouldRooms();
        this.getQueueInfo();
        this.getQueue(this.state.params);
    }

    getMouldRooms = () => {
        xhr.get(url.mouldRooms, {}, (data) => {
            let area = data.map(v => <Option key={v.id}>{v.name}</Option>);
            area = [<Option key={'0'}>全部科室</Option>, ...area]
            this.setState({
                area
            }, () => {
                const box = document.getElementsByClassName('queueTable');
                console.log(box[0].offsetWidth)
                this.setState({
                    pageWidth: {width: box[0].offsetWidth, textAlign: 'right'}
                })
            })
        })
    };

    getQueueInfo = () => {
        xhr.get(url.getQueueInfo, {date: Moment().format('YYYY-MM-DD')}, (data) => {
            this.setState({
                queueInfo: data
            })
        })
    };

    getQueue = (params = {}) => {
        xhr.get(url.getQueue, params, (data) => {
            this.setState({
                data: data.rows,
                params: {...params, totalPage: data.totalNumber}
            })
        })
    };

    stop(v) {
        const status = v.status != 5 ? 5 : 7;
        xhr.put(url.changeStatus, {
            date: Moment().format('YYYY-MM-DD'),
            id: v.id,
            status
        }, () => {
            this.getQueueInfo();
            this.getQueue(this.state.params);
        })
    }

    toQueue(v) {
        xhr.put(url.point, {id: v.id,}, () => {
            this.getQueueInfo();
            this.getQueue(this.state.params);
        })
    }

    next = () => {
        xhr.put(url.queuePoint, this.state.queueInfo, () => {
            this.getQueueInfo();
            this.getQueue(this.state.params);
        })
    }

    chooseArea = (value) => {
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                departmentId: value
            }
        }, () => {
            this.getQueue(this.state.params);
        })
    };

    searchPatient = (value) => {
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                keyWord: value
            }
        }, () => {
            this.getQueue(this.state.params);
        })
    };

    handlePagination = (pageNum) => {
        let page = {...this.state.params, current: pageNum, pageNum: pageNum};
        this.getQueue(page);
    };


    render = () => {
        return (
            <div className="queue">
                <Row gutter={16}>
                    <Col xl={5} lg={5} md={6} sm={8} xs={24}>
                        <div className="display-left">
                            <div className="queueInfo">
                                <div className="text"><span
                                    className="title">当前患者：</span>{this.state.queueInfo.currentPatient || '--'}</div>
                                <div className="text"><span
                                    className="title">下个患者：</span>{this.state.queueInfo.nextPatient || '--'}</div>
                                <div className="text"><span
                                    className="title">剩余人数：</span>{this.state.queueInfo.lineCount || '--'}</div>
                            </div>
                            <div className="op-area">
                                <div className="big-btn" onClick={this.next}>顺序叫号</div>
                            </div>
                        </div>
                    </Col>
                    <Col xl={19} lg={19} md={18} sm={16} xs={24}>
                        <div className="display-right" ref="table">
                            <div className="toolbar">
                                <div className="searchFilter">
                                    <Select className="tool" showSearch size={this.state.size} style={{width: 200}}
                                            optionFilterProp="children" onSelect={this.chooseArea}
                                            placeholder="模室筛选">{this.state.area}</Select>
                                    <Search className="tool" size={this.state.size} placeholder="姓名/电话/放疗号搜索..."
                                            onSearch={this.searchPatient} style={{width: 200, marginRight: 0}}/>
                                </div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="queueTable">
                                <Table columns={this.tHeads} dataSource={this.state.data} rowKey={a => a.id}
                                       pagination={false}/>
                                <div className="page-area" style={this.state.pageWidth}>
                                    <Pagination showQuickJumper current={this.state.params.current}
                                                pageSize={this.state.params.pageSize}
                                                total={this.state.params.totalPage}
                                                onChange={this.handlePagination}/>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setTitle: subTitle
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(queue);