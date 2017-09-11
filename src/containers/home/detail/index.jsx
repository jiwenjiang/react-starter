import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col} from 'antd';
/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="mg-top20">
                <Row>
                    <Col span={5}>
                        <div style={{border:'1px solid red',height:'835px'}}>

                        </div>
                    </Col>
                    <Col span={19}>
                        <div style={{border:'1px solid yellow'}}>
                            <span >我的影像</span><span>我的影像2</span>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Main;