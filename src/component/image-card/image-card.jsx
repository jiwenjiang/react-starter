import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col, Card} from 'antd';
import url from '../../config/ip/image';
import xhr from '../../services/xhr/index';
import {sex} from '../../services/filter/index';
import '../../assets/fonts/iconfont.css';
import './image-card.less';

class ImageCard extends Component{
    constructor() {
        super();
    }

    delLiked(id){
        console.log(id)
        console.log(url.delLiked)
        xhr.post(url.delLiked, {studyId: id}, (data) => {
            console.log(data)
        })
    }

    addLiked(id){
        xhr.post(url.addLiked, {studyId: id}, (data) => {
            console.log(data)
        })
    }

    render() {
        return(
            <Row gutter={16}>
                {
                    this.props.data.map((item, index) => {
                        return <Col className="gutter-row" xl={6} lg={8} md={8} sm={12} xs={12} key={index}>
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
                                                    <div className="card-title">{item.patientId}</div>
                                                    <div className="tags">
                                                        {
                                                            item.mods.split("/").map((item) => {
                                                                switch (item){
                                                                    case "CT":
                                                                        return <div className="tag tag-CT">CT</div>;
                                                                    case "RD":
                                                                        return <div className="tag tag-RD">RD</div>;
                                                                    case "RP":
                                                                        return <div className="tag tag-RP">RP</div>;
                                                                    case "RS":
                                                                        return <div className="tag tag-RS">RS</div>;
                                                                    case "PET":
                                                                        return <div className="tag tag-PET">PET</div>;
                                                                    case "MR":
                                                                        return <div className="tag tag-MR">MR</div>;
                                                                    default:
                                                                        break;
                                                                }
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
                                                    item.isFavorite ? <icon className="iconfont icon--shoucang-" onClick={this.delLiked.bind(this,item.studyId)}></icon> : <icon className="icon-shoucang-" onClick={this.addLiked.bind(this, item.studyId)}></icon>
                                                }
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
        )
    }
}

export default ImageCard;