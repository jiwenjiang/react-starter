import React, {Component} from 'react'; // 引入了React和PropTypes
import {Button, Modal} from 'antd';
import url from '../../../../config/ip/imageCenter/dicom-ois';
import uploadUrl from '../../../../config/ip/dicomServe/';
import xhr from '../../../../services/xhr/index';
import noty from '../../../../component/common/noty'
import {Radio, Row, Col} from 'antd';
const RadioGroup = Radio.Group;


/* 以类的方式创建一个组件 */
class ImageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            checkboxes: null
        };
    }

    componentDidMount() {
        this.getList();
    }

    getList() {
        xhr.get(url.getDevice, '', (data) => {
            this.setState({
                checkboxes: data
            });
        })
    }

    handleCancel() {
        this.props.changeState(false, () => {
            this.setState({
                value: null
            });
        });
    }

    handleOk() {
        const params = {
            studyId: this.props.studyId,
            series: this.props.selectedRowKeys,
            aeInfo: this.state.value
        }
        if (this.state.value) {
            this.setState({
                loading: true
            });
            // 没有用箭头函数，保证this指向父级，消除this穿透
            this.props.changeState(true, function () {
                this.setState({
                    confirm: '正在发送'
                });
            });
            xhr.post(uploadUrl.upload, params, () => {
                this.props.changeState(false, () => {
                    this.setState({
                        value: null,
                        loading: false
                    });
                });
            }, '', () => {
                this.props.changeState(true, function () {
                    this.setState({
                        confirm: '确认'
                    });
                });
                this.setState({
                    loading: false
                });
            })
        } else {
            noty('warning', '请选择目标源');
        }

    }

    onChange(v) {
        this.setState({
            value: v.target.value,
        });
    }

    render() {
        const {loading} = this.state;
        return (
            <div>
                <Modal
                    visible={this.props.visible}
                    title="发送影像"
                    onOk={() => this.handleOk()}
                    onCancel={() => this.handleCancel()}
                    footer={[
                        <Button key="back" size="large" onClick={() => this.handleCancel()}>取消</Button>,
                        <Button key="submit" type="primary" size="large" loading={loading}
                                onClick={() => this.handleOk()}>
                            {this.props.confirm}
                        </Button>
                    ]}>
                    <p><span style={{'fontSize': '14px', 'color': '#38424b'}}>选择目标源</span></p>
                    <RadioGroup onChange={(v) => this.onChange(v)} value={this.state.value} style={{'width': '100%'}}>
                        <Row>
                            {this.state.checkboxes && this.state.checkboxes.map((v, i) => {
                                return <Col key={v.id} span={(i + 1) % 5 ? 5 : 4}>
                                    <Radio style={{'margin': '5px 0px'}}
                                           value={v}>{v.name}</Radio>
                                </Col>
                            })}
                        </Row>
                    </RadioGroup>

                </Modal>
            </div>
        );
    }
}


export default ImageModal;