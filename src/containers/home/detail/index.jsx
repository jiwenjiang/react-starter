import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col, Tabs, Table} from 'antd';
import url from '../../../config/ip/detail';
import xhr from '../../../services/xhr/index';
import {sex} from '../../../services/filter';
import './index.less';
import {SeriesHeads} from '../data';

function callback() {

}
const TabPane = Tabs.TabPane;
/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            details: {},
            selectedRowKeys: [],
            loading: false,
            seriesParams: {
                studyId: "1",
                platformId: "OIS",
                pageSize: 1
            },
        };

    }

    componentDidMount() {
        this.getList(this.state.seriesParams);
        this.getDetail(this.state.seriesParams);
    }

    getDetail() {
        xhr.get(url.imgList, {studyIds: '1', platformId: 'OIS'}, (data) => {
            this.setState({
                details: data.resultList ? data.resultList[0] : {}
            });
        })
    }

    getList(param = {}) {
        xhr.get(url.imgDetail, param, (data) => {
            let seriesBodys = data.resultList.map((v) => {
                let obj = {};
                for (let item of SeriesHeads) {
                    obj[item.dataIndex] = v[item.dataIndex]
                }
                obj.key = v.id;
                return obj
            })
            this.setState({
                seriesBodys: seriesBodys,
                seriesParams: {...this.state.seriesParams, total: data.resultCount}
            });
        })
    }

    handleTableChange = (pagination) => {
        const page = {...this.state.seriesParams, pageNo: pagination.current}
        this.getList(page)
    }

    onSelectChange = (selectedRowKeys) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({selectedRowKeys});
    }

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        return (
            <div className="mg-top20">
                <Row>
                    <Col span={5} className="img-detail">
                        <div className="part">
                            <i className="iconfont icon-HEAD"></i>
                            <div>{this.state.details.studyDesc}</div>
                            <p className="mg-top20">{this.state.details.patientId}</p>
                            <p>{this.state.details.patientName}</p>
                            <p>{sex(this.state.details.sex) + '/' + (this.state.details.age ? this.state.details.age + '岁' : '')}</p>
                            <p>{this.state.details.studyDate}</p>
                            <div className="collect">
                                <i className="iconfont icon-shoucang-"></i>
                                <span className="block">添加收藏</span>
                            </div>
                        </div>
                    </Col>
                    <Col span={19}>
                        <div className="img-list">
                            <Tabs defaultActiveKey="1" onChange={callback}>
                                <TabPane tab="Tab 1" key="1">
                                    <button className="lm-circleBtn">下载影像</button>
                                    <button className="lm-circleBtn">发送影像</button>
                                    <div className="seriesTB">
                                        <Table rowSelection={rowSelection} columns={SeriesHeads}
                                               pagination={this.state.seriesParams}
                                               loading={this.state.loading}
                                               onChange={this.handleTableChange}
                                               dataSource={this.state.seriesBodys}/>
                                    </div>
                                </TabPane>
                                <TabPane tab="Tab 2" key="2">
                                    4442
                                </TabPane>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Main;