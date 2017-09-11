import React, {Component} from 'react'; // 引入了React和PropTypes
// import {Row, Col} from 'antd';
import {Menu, Icon, Row, Col, Card} from 'antd';
import url from '../../../config/ip/image';
import xhr from '../../../services/xhr/index';
import './image.less';

// const SubMenu = Menu.SubMenu;
// const MenuItemGroup = Menu.ItemGroup;

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getData();
    }

    state = {
        current: 'allList'
    };

    handleClick = (e) => {
        this.setState({
            current: e.key
        });
    };

    getData() {
        xhr.get(url.imgList, {platformId: 'archive_test'}, (data) => {
            console.log(data)
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
                        <Col className="gutter-row" span={6}>
                            <Card className="list-card">
                                <div className="card-display">
                                    <Row>
                                        <Col span={4}>
                                            <div className="icon-display">
                                                <Icon type="medicine-box"></Icon>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            <div className="display-content">
                                                <Row>
                                                    <div className="card-title">510104199302879565755</div>
                                                    <div className="tags">
                                                        <div className="tag tag-ct">CT</div>
                                                    </div>
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
                                                            这是一段测试描述，一定要很长很长，长到撑过card宽度.
                                                        </div>
                                                    </Col>
                                                    <Col span={11} offset={8}>
                                                        <div className="cure-date">
                                                            (M/28Y)
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
                    </Row>
                </div>
            </div>
        );
    }
}

export default Main;