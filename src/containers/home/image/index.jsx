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
        xhr.get(url.imgList, {platformId: 'archive_test'}, (data) => {
            console.log(data)
        })
    }

    render() {
        return (
            <div>
                233
                <Row>
                    <Col span={12}>
                        <div>
                            <span >我的影像</span><span>我的影像2</span>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Main;