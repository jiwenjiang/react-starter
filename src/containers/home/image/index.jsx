import React, {Component} from 'react'; // 引入了React和PropTypes
// import {Row, Col} from 'antd';
import {Menu, Icon, Row, Col, Card, Pagination} from 'antd';
import url from '../../../config/ip/image';
import xhr from '../../../services/xhr/index';
import '../../../assets/fonts/iconfont.css';
import './image.less';

// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 'allList',
            pageSize: 20,
            data: []
        };
    }

    componentDidMount() {
        this.getData(1);
    }



    handleClick = (e) => {
        this.setState({
            current: e.key
        });
    };

    getData(pageNumber) {
        xhr.get(url.imgList, {platformId: 'archive_test', pageSize: 20, pageNo: pageNumber}, (data) => {
            this.setState({
                pageSize: this.state.pageSize,
                pageNum: data.pageNum,
                data: data.data.resultList || [],
                totalPage: data.data.resultCount
            })
        })
    }


    render() {
        return (
            <div className="imageCenter">
                <Menu
                    onClick={this.handleClick}
                    selectedKeys={[this.state.current]}
                    mode="horizontal" className="image-tab"
                >
                    <Menu.Item Key="allList">
                        本院影像
                    </Menu.Item>
                    <Menu.Item Key="likedList">
                        收藏影像
                    </Menu.Item>
                </Menu>
                <div className="panel-content">
                <Row gutter={16}>
                    {
                        this.state.data.map((item, index) => {
                            return <Col className="gutter-row" span={6} Key={index}>
                                <Card className="list-card">
                                    <div className="card-display">
                                        <Row gutter={16}>
                                            <Col span={4} className="icon-wrapper">
                                                <div className="icon-display">
                                                    <div className="iconfont icon-ABDOMEN"></div>
                                                </div>
                                            </Col>
                                            <Col span={20}>
                                                <div className="display-content">
                                                    <Row>
                                                        <div className="card-title">510104199302879565755</div>
                                                        <div className="tags">
                                                            <div className="tag tag-ct">CT</div>
                                                        </div>
                                                        <div className="clearfix"></div>
                                                    </Row>
                                                    <Row>
                                                        <Col span={16}>
                                                            <div className="description">
                                                                这是一段测试描述，一定要很长很长，长到撑过card宽度.
                                                            </div>
                                                        </Col>
                                                        <Col span={8}>
                                                            <div className="patient-info">
                                                                (M/28Y)
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={4}>
                                                            <div className="cure-section">
                                                                {item.studyDesc}
                                                            </div>
                                                        </Col>
                                                        <Col span={11} offset={9}>
                                                            <div className="cure-date">
                                                                2017.08.03 15:56:32
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div className="card-toolbar">
                                        <Row>
                                            <Col span={6}>
                                                <div className="liked-area">
                                                    <Icon type="star-o"></Icon>
                                                </div>
                                            </Col>
                                            <Col span={6} offset={6}>
                                                <button className="mybtn">详情</button>
                                            </Col>
                                            <Col span={6}>
                                                <button className="mybtn">阅片</button>
                                            </Col>
                                        </Row>
                                    </div>
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div>
                <Pagination showQuickJumper defaultCurrent={1} total={this.state.totalPage} onChange={this.getData} />
            </div>
        );
    }
}

export default Main;