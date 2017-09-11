import React, {Component} from 'react'; // 引入了React和PropTypes
// import {Row, Col} from 'antd';
import {Menu, Row, Col} from 'antd';
import url from '../../../config/ip/image';
import xhr from '../../../services/xhr/index';
// import './image.less';

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
    }

    handleClick = (e) => {
        this.setState({
            current: e.key
        });
    }

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
                    mode="horizontal"
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
                        <Col></Col>
                    </Row>
                </div>
            </div>
        );
    }
}

export default Main;