import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col} from 'antd';
import url from '../../../config/ip/image';
import xhr from '../../../services/xhr/index';

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.getData();
    }

    getData() {
        xhr.get(url.imgList,{platformId:'archive_test'},(data)=>{

        })
    }

    render() {
        return (
            <Row>
                <Col span={6}></Col>
            </Row>
        );
    }
}

export default Main;