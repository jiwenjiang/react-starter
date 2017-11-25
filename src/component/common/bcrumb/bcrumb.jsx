import React, {Component} from 'react';

import {Breadcrumb, Row, Col} from 'antd';
import {Link} from 'react-router';
import './bcrumb.less'


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
                        {this.props.titles && this.props.titles.map((v, i) => {
                            return <Breadcrumb.Item key={i}>
                                <Link to={v.link}><span
                                    className={`${i == 0 ? 'ml-10' : ''} inlinblock`}>{v.text}</span></Link>
                            </Breadcrumb.Item>
                        })}
                    </Breadcrumb>
                </Col>
            </Row>

        )
    }
}