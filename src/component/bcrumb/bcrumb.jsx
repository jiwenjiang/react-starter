import React, {Component} from 'react';

import {Breadcrumb, Row, Col} from 'antd';
import {Link} from 'react-router';
import './style/bcrumb.less'


/**
 * 公共面包屑
 *
 * @export
 * @class Bcrumb
 * @extends {Component}
 */
export class Bcrumb extends Component {
    constructor(props) {
        super(props); //后才能用this获取实例化对象
    }

    render() {
        return (
            <Row className="mt-10">
                <Col span={24}>
                    <Breadcrumb className="bread-crumb">
                        <Breadcrumb.Item>
                            <Link to="/home"><span className="ml-10 inlinblock">影像中心</span></Link>
                        </Breadcrumb.Item>
                        {this.props.title
                            ? <Breadcrumb.Item>
                                <span>{ this.props.title }</span>
                            </Breadcrumb.Item>
                            : null}
                    </Breadcrumb>
                </Col>
            </Row>

        )
    }
}