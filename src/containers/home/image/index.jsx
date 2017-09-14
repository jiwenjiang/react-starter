import React, {Component} from 'react'; // 引入了React和PropTypes
import {Tabs, Pagination, Select, DatePicker, Input} from 'antd';
import Moment from 'moment';
import ImageCard from '../../../component/image-card/image-card';
import url from '../../../config/ip/image';
import xhr from '../../../services/xhr/index';
import '../../../assets/fonts/iconfont.css';
import './image.less';
import config from '../../../config'

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Search = Input.Search;
const children = [
    <Option key='all'>全部</Option>,
    <Option key='CT'>CT</Option>,
    <Option key='MR'>MR</Option>,
    <Option key='RTIMAGE'>PET</Option>,
    <Option key='RTDOSE'>RD</Option>,
    <Option key='RTPLAN'>RP</Option>,
    <Option key='RTSTRUCT'>RS</Option>
];

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.condition = {

        }
        this.state = {
            size: 'large',
            params: {
                pageSize: 20,
                platformId: config.platform,
                pageNum: 1,
                current: 1,
                modality: '',
                patientIdOrName: ''
            },
            data: []
        };
        this.onTabChange = this.onTabChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.params);
    }

    onTabChange = (activeKey) => {
        switch (activeKey){
            case 'tab1':
                this.setState({
                    size: 'large',
                    params: {
                        pageSize: 20,
                        platformId: config.platform,
                        pageNum: 1,
                        current: 1,
                        modality: '',
                        patientIdOrName: '',
                        studyIds: []
                    },
                    data: []
                }, () => {
                    this.getData(this.state.params);
                });

                break;
            case 'tab2':
                this.setState({
                    size: 'large',
                    params: {
                        pageSize: 20,
                        platformId: config.platform,
                        pageNum: 1,
                        current: 1,
                        modality: '',
                        patientIdOrName: '',
                        studyIds: []
                    },
                    data: []
                }, () => {
                    xhr.get(url.likedIds, {}, (data) => {
                        let ids = data;
                        this.getData({...this.state.params, studyIds: ids});
                    })
                });
        }
    }

    handlePagination = (pageNumber) => {
        const page = {...this.state.params, current: pageNumber, pageNum: pageNumber};
        this.getData(page);
    }

    handleSelect = (value) => {
        if(value == 'all'){
            this.condition.modality = '';
        }
        else{
            this.condition.modality = value;
        }
        this.getData(this.state.params);
    };

    handleSearch = (e) => {
        this.condition.patientIdOrName = e.target.value;
        this.getData(this.state.params);
    };

    handleDate = (value) => {
        if(value === null){
            this.condition.studyTime = '';
        }
        else{
            this.condition.studyTime = Moment(value).format('YYYY-MM-DD');
        }
        this.getData(this.state.params);
    }

    getData = (params = {}) => {
        params = {...params, ...this.condition};
        xhr.get(url.imgList, params, (data) => {
            this.setState({
                data: data.resultList || [],
                params: {
                    ...params,
                    totalPage: data.resultCount
                }
            });
        })
    }


    render() {
        return (
            <div className="imageCenter">
                <Tabs defaultActiveKey="tab1" className="image-tab" onChange={this.onTabChange}>
                    <TabPane tab="本院影像" key="tab1">
                        <div className="panel-content">
                            <ImageCard refresh={this.handlePagination.bind(this)} pageNum={this.state.params.pageNum} data={this.state.data} />
                            <div className="page-area">
                                <Pagination showQuickJumper  current={this.state.params.current} pageSize={this.state.params.pageSize} total={this.state.params.totalPage} onChange={this.handlePagination} />
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="收藏影像" key="tab2">
                        <div className="panel-content">
                            <ImageCard refresh={this.handlePagination.bind(this)} pageNum={this.state.params.pageNum} data={this.state.data}/>
                            <div className="page-area">
                                <Pagination showQuickJumper current={this.state.params.current} pageSize={this.state.params.pageSize} total={this.state.params.totalPage} onChange={this.handlePagination} />
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
                <div className="tools">
                    <Select className="tool" onSelect={this.handleSelect} size={this.state.size} defaultValue="all"  style={{width: 200}}>
                        {children}
                    </Select>
                    <DatePicker className="tool" onChange={this.handleDate} size={this.state.size} style={{width: 200}}/>
                    <Search className="tool" size={this.state.size} onBlur={this.handleSearch.bind(this)} placeholder="输入姓名或ID搜索…" style={{width: 200}}/>
                </div>
            </div>
        );
    }
}

export default Main;