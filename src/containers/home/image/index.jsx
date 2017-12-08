import React, {Component} from 'react';
import {Select, DatePicker, Input, Spin, Alert} from 'antd';
import Moment from 'moment';
import url from '_config/ip/imageCenter/image.js';
import xhr from '../../../services/xhr/index';
import './image.less';
import config from '_config/index';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import {Lmtab} from '../../../component/common/lmtab'

// import NProgress from 'nprogress';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const Search = Input.Search;
const children = [
    <Option key='all'>全部</Option>
];

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            params: {
                pageSize: 20,
                platformId: config.platform,
                pageNum: 1,
                current: 1,
                modality: 'all',
                patientIdOrName: null,
                startTime: Moment().subtract(30, 'd'),
                endTime: Moment()
            },
            data: [],
            loading: true,
            curTab: 0,
            get num(){
                console.log(this.curTab)
            }
        };
        this.onTabChange = this.onTabChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.params);
        const titles = [
            {link: '/home/image', text: 'bleach'}
        ];
        this.props.setTitle(titles);
    }

    onTabChange(i) {
        this.setState({
            curTab: i
        });
    }

    handleSelect = (value) => {
        this.setState({params: {...this.state.params, modality: value}}, () => {
            if((this.state.curTab == 1 && this.state.params.studyIds.length != 0) || this.state.curTab == 0){
                this.setState({
                    params: {
                        ...this.state.params,
                        pageNum: 1,
                        current: 1
                    }
                },() => {this.getData(this.state.params);})
            }
        });
    };

    handleInput = (e) => {
        this.setState({params: {...this.state.params, patientIdOrName: e.target.value}})
    };

    handleSearch = () => {
        if((this.state.curTab == 1 && this.state.params.studyIds.length != 0) || this.state.curTab == 0){
            this.setState({
                params: {
                    ...this.state.params,
                    pageNum: 1,
                    current: 1
                }
            },() => {this.getData(this.state.params);})
        }
    };

    handleDate = (value) => {
        let startTime = value[0];
        let endTime = value[1];
        this.setState({params: {...this.state.params, startTime: startTime, endTime: endTime}}, () => {
            if((this.state.curTab == 1 && this.state.params.studyIds.length != 0) || this.state.curTab == 0){
                this.setState({
                    params: {
                        ...this.state.params,
                        pageNum: 1,
                        current: 1
                    }
                },() => {this.getData(this.state.params);})
            }
        })
    };

    getData = (params = {}) => {

        this.setState({
            loading: true
        });
        xhr.get(url.imgList, params, (data) => {
            this.setState({
                data: data.resultList,
                params: {
                    ...params,
                    totalPage: data.resultCount
                },
                loading: false
            });
            console.log(data)
        }, () => {this.setState({loading: false})})
    };


    render() {
        const loading = <Spin tip="Loading..." size="large">
            <Alert
                message=""
                description="请耐心等待"
                type="info"
                size="large"
            />
        </Spin>
        const tabone = <div className="panel-content">

        </div>
        const tabtwo = <div className="panel-content">
            {this.state.loading
                ? loading
                : <div>
                    TAB2
                </div>}
        </div>
        return (
            <div className="imageCenter">
                <div className="tab">
                    <Lmtab tabs={['TAB1', 'TAB2']} changeTab={(i) => this.onTabChange(i)}/>
                </div>
                {this.state.curTab == 0 ? tabone : tabtwo}

                <div className="tools">
                    <Select className="tool" onSelect={this.handleSelect} value={this.state.params.modality}
                            size={this.state.size} defaultValue="all"
                            style={{width: 200}}>
                        {children}
                    </Select>
                    <RangePicker className="tool" onChange={this.handleDate} size={this.state.size}
                                 value={[this.state.params.startTime, this.state.params.endTime]} disabledDate={this.disabledDate}
                                 style={{width: 200}}/>
                    <Search className="tool" size={this.state.size} onChange={this.handleInput} onSearch={this.handleSearch.bind(this)}
                            value={this.state.params.patientIdOrName}
                            placeholder="输入姓名或ID搜索…" style={{width: 200}}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setTitle: subTitle
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);