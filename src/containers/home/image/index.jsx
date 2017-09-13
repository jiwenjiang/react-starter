import React, {Component} from 'react'; // 引入了React和PropTypes
import {Tabs, Pagination, Select, DatePicker, Input} from 'antd';
import ImageCard from '../../../component/image-card/image-card';
import url from '../../../config/ip/image';
import xhr from '../../../services/xhr/index';
import '../../../assets/fonts/iconfont.css';
import './image.less';

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
            modality: '',
            patientIdOrName: ''
        }
        this.state = {
            size: 'large',
            params: {
                pageSize: 2,
                platformId: 'OIS',
                pageNum: 1,
                current: 1
            },
            data: []
        };
        this.handlePagination = this.handlePagination.bind(this);
        this.handleParams = this.handleParams.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.params);
    }

    handlePagination(pageNumber){
        console.log(pageNumber);
        const page = {...this.state.params, current: pageNumber, pageNum: pageNumber};
        this.getData(page);
    }

    handleParams(){
        console.log(this.condition)
        if(this.state.params.modality == 'all'){
            this.state.params.modality = '';
        }
        const condition = {
            ...this.state.params,
            ...this.condition
        }
        this.getData(condition);
    }

    getData = (params = {}) => {
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
                <Tabs defaultActiveKey="tab1" className="image-tab">
                    <TabPane tab="本院影像" key="tab1">
                        <div className="panel-content">
                            <ImageCard refresh={this.handlePagination.bind(this)} pageNum={this.state.params.pageNum} data={this.state.data} />
                            <div className="page-area">
                                <Pagination showQuickJumper  current={this.state.params.current} pageSize={this.state.params.pageSize} total={this.state.params.totalPage} onChange={this.handlePagination} />
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="收藏影像" key="tab2"></TabPane>
                </Tabs>
                <div className="tools">
                    <Select className="tool" value={this.condition.modality} onSelect={this.handleParams} size={this.state.size} defaultValue="all"  style={{width: 200}}>
                        {children}
                    </Select>
                    <DatePicker className="tool" onChange={this.handleParams} size={this.state.size} style={{width: 200}}/>
                    <Search className="tool" size={this.state.size} value={this.condition.patientIdOrName} onSearch={this.handleParams} placeholder="输入姓名或ID搜索…" style={{width: 200}}/>
                </div>
            </div>
        );
    }
}

export default Main;