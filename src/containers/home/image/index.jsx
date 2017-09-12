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
    <Option key='PET'>PET</Option>,
    <Option key='RD'>RD</Option>,
    <Option key='RP'>RP</Option>,
    <Option key='RS'>RS</Option>
];

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            pageSize: 1,
            data: []
        };
    }

    componentDidMount() {
        this.getData(1);
    }

    handleParam(){
        console.log(arguments);
    }


    getData(pageNumber, modality='', patientInfo='') {
        console.log(arguments);
        xhr.get(url.imgList, {
            platformId: 'OIS',
            pageSize: 1,
            pageNum: pageNumber,
            modality: modality,
            patientIdOrName: patientInfo
        }, (data) => {
            this.setState({
                pageSize: this.state.pageSize,
                // pageNo: data.pageNum,
                data: data.resultList || [],
                totalPage: data.pageCount
            })
        })
    }


    render() {
        return (
            <div className="imageCenter">
                <Tabs defaultActiveKey="1" className="image-tab">
                    <TabPane tab="本院影像" key="tab1">
                        <div className="panel-content">
                            <ImageCard data={this.state.data} />
                            <div className="page-area">
                                <Pagination showQuickJumper defaultCurrent={1} total={this.state.totalPage} onChange={this.handleParam} />
                                <div className="clearfix"></div>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane tab="收藏影像" key="tab2"></TabPane>
                </Tabs>
                <div className="tools">
                    <Select className="tool" size={this.state.size} defaultValue="all"  style={{width: 200}}>
                        {children}
                    </Select>
                    <DatePicker className="tool" size={this.state.size} style={{width: 200}}/>
                    <Search className="tool" size={this.state.size} placeholder="输入姓名或ID搜索…" style={{width: 200}}/>
                </div>
            </div>
        );
    }
}

export default Main;