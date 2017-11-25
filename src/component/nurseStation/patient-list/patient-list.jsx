import React, {Component} from 'react';
import {Select, Cascader, DatePicker, Input, Pagination} from 'antd';
// import Moment from 'moment';
import PatientCard from '../patient-card/patient-card';
import PatientTable from '../patient-table/patient-table';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import url from '../../../config/ip/nurseStation/nurseStation';
import xhr from '../../../services/xhr/index';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import Moment from 'moment';
import './patient-list.less';

const Option = Select.Option;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
let areas = [];
let range = [];

class patientList extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        range = [
            Moment().subtract(90, 'days'), Moment()
        ];
        this.state = {
            params: {
                pageNum: 1,
                pageSize: 20,
                current: 1,
                startTime: range[0].format('YYYY-MM-DD'),
                endTime: range[1].format('YYYY-MM-DD')
            },
            size: 'large',
            curTable: 0
        };
        this.getList(this.state.params);
    }

    componentDidMount() {
        const titles = [
            {link: '/home/nurseStation/curPatient', text: '护士工作站'},
            {link: '/home/nurseStation/curPatient', text: '当前患者'}
        ];
        this.props.setTitle(titles);
        this.getArea();
    }

    disabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    };

    getArea = () => {
        xhr.get(url.getArea, {}, (data) => {
            areas = [<Option key="null">全部</Option>];
            areas = areas.concat(data.map(v => {
                return <Option key={v.id}>{v.name}</Option>
            }));
            this.setState({areas: areas});
        })
    };

    chooseStatus = (value) => {
        let status = value[0];
        let taskKey = value[1];
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                status: status,
                taskKey: taskKey
            }
        }, () => {
            this.getList(this.state.params);
        })
    };
    chooseArea = (value) => {
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                organizationId: value
            }
        }, () => {
            this.getList(this.state.params);
        })
    };
    chooseRange = (date, dateString) => {
        let startTime = dateString[0];
        let endTime = dateString[1];
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                startTime: startTime,
                endTime: endTime
            }
        }, () => {
            this.getList(this.state.params);
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
            this.getList(this.state.params);
        })
    };

    getList = (param = {}) => {
        xhr.get(url.getList, param, (data) => {
            // let param = param;
            this.setState({
                data: data.rows,
                params: {...param, totalPage: data.totalNumber}
            })
        })
    };

    changeTable = (num) => {
        // let number = (num == 0 ? 20 : 12);
        this.setState({
            curTable: num,
        })
    };


    handlePagination = (pageNum) => {
        let page = {...this.state.params, current: pageNum, pageNum: pageNum};
        this.getList(page);
    };

    render() {
        const statusOption = [{
            value: '全部',
            label: '全部',
            children: [{
                value: 'add',
                label: '新增'
            }, {
                value: 'location',
                label: '定位'
            }, {
                value: 'hookTheTarget',
                label: '勾靶'
            }, {
                value: 'plan',
                label: '计划'
            }, {
                value: 'restoration',
                label: '复位'
            }, {
                value: 'treatment',
                label: '治疗'
            }, {
                value: 'end',
                label: '结束'
            }]
        }, {
            value: '进行中',
            label: '进行中',
            children: [{
                value: 'add',
                label: '新增'
            }, {
                value: 'location',
                label: '定位'
            }, {
                value: 'hookTheTarget',
                label: '勾靶'
            }, {
                value: 'plan',
                label: '计划'
            }, {
                value: 'restoration',
                label: '复位'
            }, {
                value: 'treatment',
                label: '治疗'
            }]
        }, {
            value: '结束',
            label: '结束',
            children: [{
                value: 'end',
                label: '结束'
            }]
        }, {
            value: '异常',
            label: '异常',
            children: [{
                value: 'add',
                label: '新增'
            }, {
                value: 'location',
                label: '定位'
            }, {
                value: 'hookTheTarget',
                label: '勾靶'
            }, {
                value: 'plan',
                label: '计划'
            }, {
                value: 'restoration',
                label: '复位'
            }, {
                value: 'treatment',
                label: '治疗'
            }]
        }];
        return (
            <div className="patientList">
                <div className="toolbar">
                    <div className="switchTable">
                        <span className={`iconfont icon-ziyuanku1 ${this.state.curTable == 0 ? 'active' : ''}`}
                              onClick={() => {
                                  this.changeTable(0)
                              }}></span>
                        <span className={`iconfont icon-liebiao ${this.state.curTable == 0 ? '' : 'active'}`}
                              onClick={() => {
                                  this.changeTable(1)
                              }}></span>
                    </div>
                    <div className="searchFilter">
                        <Cascader className="tool" options={statusOption} size={this.state.size} style={{width: 200}}
                                  onChange={this.chooseStatus} expandTrigger="hover" placeholder="状态筛选"/>
                        <Select className="tool" showSearch size={this.state.size} style={{width: 200}}
                                optionFilterProp="children" onSelect={this.chooseArea}
                                placeholder="科室筛选">{this.state.areas}</Select>
                        <RangePicker size={this.state.size} style={{width: 300, marginRight: 10}} defaultValue={range}
                                     disabledDate={this.disabledDate} onChange={this.chooseRange}/>
                        <Search className="tool" size={this.state.size} placeholder="姓名/电话/放疗号搜索..."
                                onSearch={this.searchPatient} style={{width: 200}}/>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="content" ref="content">
                    {
                        this.state.curTable == 0 ?
                            (<PatientCard data={this.state.data}></PatientCard>) : (
                            <PatientTable data={this.state.data}></PatientTable>)
                    }
                </div>
                <div className="page-area" ref="pagination">
                    <Pagination showQuickJumper current={this.state.params.current}
                                pageSize={this.state.params.pageSize} total={this.state.params.totalPage}
                                onChange={this.handlePagination}/>
                    <div className="clearfix"></div>
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(patientList);