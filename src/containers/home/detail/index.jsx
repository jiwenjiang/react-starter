import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col, Table, Spin} from 'antd';
import url from '../../../config/ip/imageCenter/detail';
import imgUrl from '../../../config/ip/imageCenter/image';
import xhr from '../../../services/xhr/index';
import config from '_config';
import {sex, bodyPart} from '../../../services/filter';
import './index.less';
import {SeriesHeads} from '../data';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import ImageModal from './modal/index';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Lmtab} from '../../../component/common/lmtab';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            details: {},
            selectedRowKeys: [],
            loading: false,
            seriesParams: {
                studyId: this.props.params.id,
                pageSize: 10
            },
            loaddetail: true,
            visible: false,
            curTab: 0
        };
    }

    componentDidMount() {
        this.getList(this.state.seriesParams);
        this.getDetail();
        const titles = [
            {link: '/home/image', text: '影像中心'},
            {link: `/home/detail/${this.props.params.id}`, text: '影像详情'}
        ];
        this.props.setTitle(titles);
    }

    getDetail() {
        xhr.get(imgUrl.imgList, {studyIds: this.props.params.id, platformId: config.platform}, (data) => {
            this.setState({
                details: data.resultList ? data.resultList[0] : {},
                loaddetail: false
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

    addCollect(a) {
        xhr[a ? 'delete' : 'post'](imgUrl[a ? 'delLiked' : 'addLiked'], {studyId: this.state.details.studyId}, () => {
            this.getDetail();
        })
    }

    exportID() {
        xhr.get(url.exportId, {studyId: this.props.params.id}, (data) => {
            window.open(`${window.location.origin}/download/${data.id}`);
        })
    }

    handleTableChange = (pagination) => {
        const page = {...this.state.seriesParams, pageNo: pagination.current}
        this.getList(page)
    }

    onSelectChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys});
    }

    sendImg() {
        this.setState({
            visible: true,
            confirm: '确认'
        });
    }

    changeState(param, cb) {
        this.setState({
            visible: param
        }, cb);
    }

    changeTab(i) {
        this.setState({
            curTab: i
        });
    }

    render() {
        const {selectedRowKeys} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        }
        let isFavorite = this.state.details.isFavorite;
        let studyDesc = this.state.details.studyDesc;
        const loading = <Spin style={{'marginTop': '50px'}} size="large"></Spin>
        const {visible} = this.state;

        const tabone = <div className="mt-15">
            <button className="lm-circleBtn" onClick={() => this.exportID()}>下载影像</button>
            <button className="lm-circleBtn ml-20" onClick={() => this.sendImg()}>发送影像</button>
            <div className="seriesTB">
                <Table rowSelection={rowSelection} columns={SeriesHeads}
                       pagination={this.state.seriesParams}
                       loading={this.state.loading}
                       onChange={this.handleTableChange}
                       dataSource={this.state.seriesBodys}/>
            </div>
        </div>

        const tabtwo = <div></div>
        return (
            <div className="mg-top20">
                <ImageModal visible={visible} changeState={(x, cb) => this.changeState(x, cb)}
                            studyId={this.props.params.id} confirm={this.state.confirm}
                            selectedRowKeys={selectedRowKeys}/>
                <Row>
                    <Col span={5} className="img-detail">
                        <div className="part">
                            {
                                this.state.loaddetail
                                    ? loading
                                    : <div>
                                    <i className={`iconfont ${'icon-' + bodyPart(studyDesc)} blue`}></i>
                                    <div>{this.state.details.studyDesc}</div>
                                    <p className="mg-top20">{this.state.details.patientId}</p>
                                    <p>{this.state.details.patientName}</p>
                                    <p>{sex(this.state.details.sex) + '/' + (this.state.details.age ? this.state.details.age + '岁' : '')}</p>
                                    <p>{this.state.details.studyDate}</p>
                                    <div className="collect"
                                         style={isFavorite ? {color: '#408ee6'} : {color: '#a3aaae'}}>
                                        <i className={`iconfont ${isFavorite ? 'icon--shoucang-' : 'icon-shoucang-'} `}
                                           onClick={this.addCollect.bind(this, isFavorite)}></i>
                                        <span className="block">{isFavorite ? '已收藏' : '添加收藏'}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    </Col>
                    <Col span={19}>
                        <div className="img-list">
                            <Lmtab tabs={['序列信息', '操作信息']} changeTab={(i) => this.changeTab(i)}/>
                            {this.state.curTab == 0 ? tabone : tabtwo}
                        </div>
                    </Col>
                </Row>
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