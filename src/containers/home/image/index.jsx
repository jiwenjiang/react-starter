import React, {Component} from 'react'; // 引入了React和PropTypes
import {Pagination, Select, DatePicker, Input, Spin, Alert} from 'antd';
import Moment from 'moment';
import ImageCard from '../../../component/image-card/image-card';
import xhr from '../../../services/xhr/index';
import './image.less';
import config from '../../../config/index';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Lmtab} from '../../../component/lmtab'

// import NProgress from 'nprogress';


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
        this.condition = {}
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
            data: [],
            loading: true
        };
        this.onTabChange = this.onTabChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }

    componentDidMount() {
        this.getData(this.state.params);
        // const titles = [{link: '/home/image', text: '影像中心'}];
        // this.props.setTitle(titles);
    }

    onTabChange(i) {
        switch (i) {
            case 0:
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
                    data: [],
                    curTab: i
                }, () => {
                    this.getData(this.state.params);
                });

                break;
            case 1:
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
                    data: [],
                    curTab: i
                }, () => {
                    xhr.get('', {}, (data) => {
                        let ids = data;
                        if (ids.length != 0) {
                            this.getData({...this.state.params, studyIds: ids.join(',')});
                        }
                    })
                });
        }
    }

    handlePagination = (pageNumber) => {
        const page = {...this.state.params, current: pageNumber, pageNum: pageNumber};
        this.getData(page);
    }

    handleSelect = (value) => {
        if (value == 'all') {
            this.condition.modality = '';
        }
        else {
            this.condition.modality = value;
        }
        this.getData(this.state.params);
    };

    handleSearch = (e) => {
        this.condition.patientIdOrName = e.target.value;
        this.getData(this.state.params);
    };

    handleDate = (value) => {
        if (value === null) {
            this.condition.studyTime = '';
        }
        else {
            this.condition.studyTime = Moment(value).format('YYYY-MM-DD');
        }
        this.getData(this.state.params);
    }

    getData = (params = {}) => {
        this.setState({
            loading: true
        });
        params = {...params, ...this.condition};
        xhr.get('', params, (data) => {
            this.setState({
                data: data&&data.resultList,
                params: {
                    ...params,
                    totalPage: data&&data.resultCount
                },
                loading: false
            });
        })
    }


    render() {
        const loading = <Spin tip="Loading..." size="large">
            <Alert
                message=""
                description="影像列表加载中，请耐心等待"
                type="info"
                size="large"
            />
        </Spin>
        const tabone = <div className="panel-content">
            {this.state.loading
                ? loading
                : <div>
                    <ImageCard refresh={this.handlePagination.bind(this)}
                               pageNum={this.state.params.pageNum}
                               data={this.state.data}/>
                    <div className="page-area">
                        <Pagination showQuickJumper current={this.state.params.current}
                                    pageSize={this.state.params.pageSize}
                                    total={this.state.params.totalPage}
                                    onChange={this.handlePagination}/>
                        <div className="clearfix"></div>
                    </div>
                </div>}
        </div>
        const tabtwo = <div className="panel-content">
            {this.state.loading
                ? loading
                : <div>
                    <ImageCard refresh={this.handlePagination.bind(this)}
                               pageNum={this.state.params.pageNum}
                               data={this.state.data}/>
                    <div className="page-area">
                        <Pagination showQuickJumper current={this.state.params.current}
                                    pageSize={this.state.params.pageSize}
                                    total={this.state.params.totalPage}
                                    onChange={this.handlePagination}/>
                        <div className="clearfix"></div>
                    </div>
                </div>}
        </div>
        return (
            <div className="imageCenter" style={{'marginTop': 15}}>
                <div className="tab">
                    <Lmtab tabs={['TAB_ONE', 'TAB_TWO']} curTab={1} changeTab={(i) => this.onTabChange(i)}/>
                </div>
                {this.state.curTab == 0 ? tabone : tabtwo}

                <div className="tools">
                    <Select className="tool" onSelect={this.handleSelect} size={this.state.size} defaultValue="all"
                            style={{width: 200}}>
                        {children}
                    </Select>
                    <DatePicker className="tool" onChange={this.handleDate} size={this.state.size}
                                style={{width: 200}}/>
                    <Search className="tool" size={this.state.size} onBlur={this.handleSearch.bind(this)}
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
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);