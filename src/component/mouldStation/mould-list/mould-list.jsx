import React, {Component} from 'react';
import {Select, DatePicker, Input, Pagination} from 'antd';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import url from '../../../config/ip/mouldStation/mouldStation';
import xhr from '../../../services/xhr/index';
import Moment from 'moment';
import MouldCard from '../mould-card/mould-card';
import './mould-list.less';

const Option = Select.Option;
const Search = Input.Search;
const RangePicker = DatePicker.RangePicker;
const mouldState = [
    <Option key="null">全部</Option>,
    <Option key="1">已申请</Option>,
    <Option key="2">待做模</Option>,
    <Option key="3">已完成</Option>
];
const priceState = [
    <Option key="null">全部</Option>,
    <Option key="0">未划价</Option>,
    <Option key="1">已划价</Option>
];
let areas = [];
let range = [];

class mouldList extends Component {
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
        this.getArea();
        this.getTherapyDoctors();
    }

    disabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    };

    getTherapyDoctors = () => {
        xhr.get(url.getThyDocs, {}, (data) => {
            let therapyDoctors = data && data.map(v => {
                    return <Option key={v.doctorId}>{v.doctorName}</Option>
                });
            this.setState({therapyDoctors: therapyDoctors})
        })
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
    chooseDoctor = (value) => {
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                doctorId: value
            }
        }, () => {
            this.getList(this.state.params);
        })
    };
    chooseStatus = (value) => {
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                status: value
            }
        }, () => {
            this.getList(this.state.params);
        })
    };
    choosePayStatus = (value) => {
        this.setState({
            params: {
                ...this.state.params,
                pageNum: 1,
                current: 1,
                payStatus: value
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


    handlePagination = (pageNum) => {
        let page = {...this.state.params, current: pageNum, pageNum: pageNum};
        this.getList(page);
    };

    render() {
        return (
            <div className="mouldList">
                <div className="toolbar">
                    <div className="searchFilter">
                        <Select className="tool" size={this.state.size} style={{width: 200}}
                                onChange={this.chooseStatus} placeholder="状态筛选">{mouldState}</Select>
                        <Select className="tool" showSearch size={this.state.size} style={{width: 200}}
                                optionFilterProp="children" onSelect={this.chooseArea}
                                placeholder="申请科室">{this.state.areas}</Select>
                        <Select className="tool" showSearch size={this.state.size} style={{width: 200}}
                                optionFilterProp="children" onSelect={this.chooseDoctor}
                                placeholder="放疗医生">{this.state.therapyDoctors}</Select>
                        <Select className="tool" size={this.state.size} style={{width: 200}}
                                onChange={this.choosePayStatus} placeholder="收费状态">{priceState}</Select>
                        <RangePicker size={this.state.size} style={{width: 300, marginRight: 10}} defaultValue={range}
                                     disabledDate={this.disabledDate} onChange={this.chooseRange}/>
                        <Search className="tool" size={this.state.size} placeholder="姓名/电话/放疗号搜索..."
                                onSearch={this.searchPatient} style={{width: 200}}/>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="content" ref="content">
                    <MouldCard data={this.state.data} getList={this.getList} params={this.state.params} />
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

export default mouldList;