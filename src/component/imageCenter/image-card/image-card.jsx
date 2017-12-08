import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col, Card} from 'antd';
import url from '_config/ip/imageCenter/image';
import xhr from '_services/xhr/index';
import {sex, modality, modalityTxt, bodyPart} from '_services/filter/index';
import '_assets/fonts/iconfont.css';
import './image-card.less';
import {browserHistory} from 'react-router';
import config from '_config/index';


class ImageCard extends Component {
    constructor(props) {
        super(props);
    }

    opLiked(item) {
        if (item.isFavorite) {
            xhr.delete(url.delLiked, {studyId: item.studyId}, () => {
                this.props.refresh(this.props.pageNum);
            })
        }
        else {
            xhr.post(url.addLiked, {studyId: item.studyId}, () => {
                this.props.refresh(this.props.pageNum);
            })
        }
    }

    gotoDetail(id) {
        browserHistory.push(`/home/detail/${id}`);
    }

    gotoImg(id) {
        window.open(config.viewer + '?params=' + btoa(`[[${id}],"${config.platform}","${sessionStorage.accessToken}"]`));
    }

    render() {
        return (
            <Row gutter={16}>
                {
                    this.props.data && this.props.data.map((item, index) => {
                        return <Col className="gutter-row" xl={6} lg={8} md={8} sm={12} xs={12} key={index}>
                            <Card className="list-card">
                                <div className="card-display">
                                    <Row gutter={16}>
                                        <Col span={4} className="icon-wrapper">
                                            <div className="icon-display">
                                                <div className={`iconfont icon-${bodyPart(item.studyDesc)}`}></div>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            <div className="display-content">
                                                <Row>
                                                    <div className="card-title">{item.patientId}</div>
                                                    <div className="tags">
                                                        {
                                                            item.mods && item.mods.split('/').map((item, index) => {
                                                                return index < 5 ? <div className="tag"
                                                                                        style={{backgroundColor: modality(item)}}
                                                                                        key={index}>{modalityTxt(item)}</div> : ''
                                                            })
                                                        }
                                                    </div>
                                                    <div className="clearfix"></div>
                                                </Row>
                                                <Row>
                                                    <Col span={16}>
                                                        <div className="description">
                                                            {item.patientName}
                                                        </div>
                                                    </Col>
                                                    <Col span={8}>
                                                        <div className="patient-info">
                                                            ({sex(item.sex)}/{item.age}岁)
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={4}>
                                                        <div className="cure-section">
                                                            {item.studyDesc}
                                                        </div>
                                                    </Col>
                                                    <Col span={13} offset={7}>
                                                        <div className="cure-date">
                                                            {item.studyDate}
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
                                                {
                                                    item.isFavorite ? <icon className="iconfont icon--shoucang-"
                                                                            onClick={this.opLiked.bind(this, item)}></icon> :
                                                        <icon className="iconfont icon-shoucang- lm-hand"
                                                              onClick={this.opLiked.bind(this, item)}></icon>
                                                }
                                            </div>
                                        </Col>
                                        <Col span={6} offset={6}>
                                            <button className="mybtn lm-hand"
                                                    onClick={this.gotoDetail.bind(this, item.studyId)}>详情
                                            </button>
                                        </Col>
                                        <Col span={6}>
                                            <button className="mybtn lm-hand" onClick={() => this.gotoImg(item.studyId)}>阅片
                                            </button>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    })
                }
            </Row>
        )
    }
}

export default ImageCard;