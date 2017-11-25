import React, {Component} from 'react'; // 引入了React和PropTypes
import {Row, Col, Form, Radio, Input, DatePicker, Select} from 'antd';
import './index.less';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import {patientSource, patientType, formItemLayout, radioItemLayout} from '../../../../services/const';
import {isEmptyObject, countAge} from '../../../../services/utils';
import url from '../../../../config/ip/nurseStation/nurseStation';
import xhr from '../../../../services/xhr/index';
import {reg_idCard, reg_phone, reg_name} from '../../../../services/regexp/';
const [FormItem, RadioGroup, Option] = [Form.Item, Radio.Group, Select.Option];

/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            patientType: '',
            patientSource: '',
            resultList: [],
            searchvalue: '',
            doctors: [],
            birthStatus: false,
            ageStatus: false
        }
        this.isChange = false;
    }

    componentDidMount() {
    }

    componentWillUpdate() {
    }

    componentDidUpdate() {
        const type = this.props.registerInfo;
        const info = this.props.patientInfo;
        if (isEmptyObject(type) === false) {
            if (type.patientType && !this.isChange) {
                this.setState({
                    patientType: type.patientType,
                    patientSource: type.patientSource
                });
            }
            if (type.patientType && !this.init) {
                this.init = true;
                this.fetchResult(type.treatResultName, (data) => {
                    this.setState({
                        resultList: data
                    });
                })
                this.changeDocs(type.areaId, this.init);
            }
        }
        if (isEmptyObject(info) === false) {
            this.patientId = info.id;
            this.detailId = type.id;
            if (info.idCard && reg_idCard.test(info.idCard)) {
                this.setState({
                    birthStatus: true,
                    ageStatus: true
                })
            }
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        if(!this.props.validImg) {
            this.props.form.validateFields((err, values) => {
                values.patientAddedDTO.job = values.patientInfo.job;
                values.patientAddedDTO.id = this.detailId;
                values.patientInfo.id = this.patientId;
                if (!err) {
                    xhr.put(url.updatePatient, values, () => {
                        if (this.props.file) {
                            let file = new FormData();
                            file.append('file', this.props.file);
                            file.append('patientId', this.patientId);
                            xhr.post(url.uploadFile, file, () => {
                                window.history.back();
                            }, {headers: {'Content-Type': 'multipart/form-data'}})
                        }
                    })
                }
            });
        }
    }

    changeType(v) {
        this.isChange = true;
        this.setState({
            patientType: v
        });
    }

    changeSrc(v) {
        this.setState({
            patientSource: v
        });
    }

    fetchData(v) {
        this.fetchResult(v, (data) => {
            this.setState({
                resultList: data
            });
        })
    }

    fetchResult(value, cb) {
        if (!value) {
            return false;
        }
        let timeout
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        let currentValue = value;

        function fake() {
            xhr.get(url.getResult, {keyWord: currentValue}, (data) => {
                if (currentValue === value) {
                    const resultList = data.map(v => {
                        return {
                            key: v.treatResultId,
                            name: v.result,
                            value: v.treatResultId
                        }
                    });
                    cb(resultList);
                }
            })
        }

        timeout = setTimeout(fake, 500);
    }

    changeDocs(v, init) {
        xhr.get(url.getDoctors, {areaId: v}, (data) => {
            this.setState({
                doctors: data
            }, () => {
                if (!init) {
                    this.props.form.setFieldsValue({
                        patientAddedDTO: {
                            doctorId: null,
                            areaId: v
                        }
                    });
                }
            });
        })
    }

    checkIdCard(e) {
        if (reg_idCard.test(e.target.value)) {
            let value = e.target.value;
            let birthdayNum = value.toString().slice(6, 14);
            let birthday = moment(birthdayNum.slice(0, 4) + '-' + birthdayNum.slice(4, 6) + '-' + birthdayNum.slice(6));
            this.setState({
                birthStatus: true,
                ageStatus: true
            }, () => {
                this.props.form.setFieldsValue({
                    patientInfo: {
                        birthday: birthday,
                        age: countAge(birthday),
                        idCard: value
                    }
                });
            });
        } else {
            this.setState({
                birthStatus: false,
                ageStatus: false
            })
        }
    }

    changePicker(e) {
        this.props.form.setFieldsValue({
            patientInfo: {
                age: countAge(e)
            }
        });
    }

    changeAge(e) {
        let value = e.target.value;
        let birthday = moment().subtract(value, 'y');
        this.props.form.setFieldsValue({
            patientInfo: {
                birthday: birthday
            }
        });
    }

    render() {
        let patientAddedDTO = this.props.registerInfo;
        const {getFieldDecorator} = this.props.form;
        const {sex, jobType, isMarried, expenseCategory, therapyTech} = this.props.dicts;
        const [orgs, areas, docs] = this.props.options;
        const {patientInfo} = this.props;
        const results = this.state.resultList && this.state.resultList.map(v => <Option key={v.key}
                                                                                        value={v.value.toString()}>{v.name}</Option>);
        const doctors = this.state.doctors && this.state.doctors.map(v => {
                return <Option key={v.doctorId}>{v.doctorName}</Option>
            });

        if (this.isChange) {
            patientAddedDTO = {
                patientType: this.state.patientType,
                patientSource: this.state.patientSource
            }
        }

        const outType = <div>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="门诊科室">
                        {getFieldDecorator('patientAddedDTO.areaId', {
                            initialValue: patientAddedDTO.areaId && patientAddedDTO.areaId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择门诊科室'
                            }]
                        })(
                            <Select onChange={(v) => this.changeDocs(v)}>
                                {orgs}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="门诊编号">
                        {getFieldDecorator('patientAddedDTO.hospitalNo', {
                            initialValue: patientAddedDTO.hospitalNo,
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="就诊日期">
                        {getFieldDecorator('patientAddedDTO.registerTime', {
                            initialValue: patientAddedDTO.registerTime && moment(patientAddedDTO.registerTime),
                        })(
                            <DatePicker style={{'width': '100%'}}/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="门诊医生">
                        {getFieldDecorator('patientAddedDTO.doctorId', {
                            initialValue: patientAddedDTO.doctorId && patientAddedDTO.doctorId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择门诊医生'
                            }],
                        })(
                            <Select>
                                {doctors}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="申请医生">
                        {getFieldDecorator('patientAddedDTO.applyDoctorId', {
                            initialValue: patientAddedDTO.applyDoctorId && patientAddedDTO.applyDoctorId.toString(),
                        })(
                            <Select>
                                {doctors}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="申请日期">
                        {getFieldDecorator('patientAddedDTO.applyTime', {
                            initialValue: patientAddedDTO.applyTime && moment(patientAddedDTO.applyTime),
                        })(
                            <DatePicker style={{'width': '100%'}}/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="放疗医生">
                        {getFieldDecorator('patientAddedDTO.radiotherapyDoctorId', {
                            initialValue: patientAddedDTO.radiotherapyDoctorId && patientAddedDTO.radiotherapyDoctorId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择放疗医生'
                            }],
                        })(
                            <Select>
                                {docs}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="治疗技术">
                        {getFieldDecorator('patientAddedDTO.iatrotechniqueId', {
                            initialValue: patientAddedDTO.iatrotechniqueId && patientAddedDTO.iatrotechniqueId.toString(),
                        })(
                            <Select>
                                {therapyTech}
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="诊疗结果">
                        {getFieldDecorator('patientAddedDTO.treatResultId', {
                            initialValue: patientAddedDTO.treatResultId && patientAddedDTO.treatResultId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择诊疗结果'
                            }],
                        })(
                            <Select
                                showArrow={false}
                                filterOption={false}
                                showSearch={true}
                                onSearch={(v) => this.fetchData(v)}
                            >
                                {results}
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </div>

        const inType = <div>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="住院病区">
                        {getFieldDecorator('patientAddedDTO.areaId', {
                            initialValue: patientAddedDTO.areaId && patientAddedDTO.areaId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择住院病区'
                            }],
                        })(
                            <Select onChange={(v) => this.changeDocs(v)}>
                                {areas}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="住院编号">
                        {getFieldDecorator('patientAddedDTO.hospitalNo', {
                            initialValue: patientAddedDTO.hospitalNo,
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="入院日期">
                        {getFieldDecorator('patientAddedDTO.registerTime', {
                            initialValue: patientAddedDTO.registerTime && moment(patientAddedDTO.registerTime)
                        })(
                            <DatePicker style={{'width': '100%'}}/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="主管医生">
                        {getFieldDecorator('patientAddedDTO.doctorId', {
                            initialValue: patientAddedDTO.doctorId && patientAddedDTO.doctorId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择主管医生'
                            }],
                        })(
                            <Select>
                                {doctors}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="申请医生">
                        {getFieldDecorator('patientAddedDTO.applyDoctorId', {
                            initialValue: patientAddedDTO.applyDoctorId && patientAddedDTO.applyDoctorId.toString(),
                        })(
                            <Select>
                                {doctors}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="申请日期">
                        {getFieldDecorator('patientAddedDTO.applyTime', {
                            initialValue: patientAddedDTO.applyTime && moment(patientAddedDTO.applyTime),
                        })(
                            <DatePicker style={{'width': '100%'}}/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="放疗医生">
                        {getFieldDecorator('patientAddedDTO.radiotherapyDoctorId', {
                            initialValue: patientAddedDTO.radiotherapyDoctorId && patientAddedDTO.radiotherapyDoctorId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择放疗医生'
                            }],
                        })(
                            <Select>
                                {docs}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="治疗技术">
                        {getFieldDecorator('patientAddedDTO.iatrotechniqueId', {
                            initialValue: patientAddedDTO.iatrotechniqueId && patientAddedDTO.iatrotechniqueId.toString(),
                        })(
                            <Select>
                                {therapyTech}
                            </Select>
                        )}
                    </FormItem>
                </Col>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="住院床号">
                        {getFieldDecorator('patientAddedDTO.bedNo', {
                            initialValue: patientAddedDTO.bedNo,
                            rules: [{
                                required: this.state.patientType == '1' ? false : true,
                                message: '请填写床号'
                            }],
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col lg={8} md={8} xl={6}>
                    <FormItem {...formItemLayout} label="诊疗结果">
                        {getFieldDecorator('patientAddedDTO.treatResultId', {
                            initialValue: patientAddedDTO.treatResultId && patientAddedDTO.treatResultId.toString(),
                            rules: [{
                                required: true,
                                message: '请选择诊疗结果'
                            }],
                        })(
                            <Select
                                showArrow={false}
                                filterOption={false}
                                showSearch={true}
                                onSearch={(v) => this.fetchData(v)}
                            >
                                {results}
                            </Select>
                        )}
                    </FormItem>
                </Col>
            </Row>
        </div>

        return (
            <div >
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <Row>
                        <Col span={24}>
                            <div className="contain">
                                <div className="patient-info">
                                    <div className="toolbar">
                                        <div className="title"><span></span>患者信息</div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <hr/>
                                    <Row className="info-content">
                                        <div className="form-area">
                                            <Row gutter={16}>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="患者来源">
                                                        {getFieldDecorator('patientAddedDTO.patientSource', {
                                                            initialValue: patientAddedDTO.patientSource,
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择患者来源'
                                                            }],
                                                        })(
                                                            <RadioGroup name="patientSource"
                                                                        onChange={(v) => this.changeSrc(v)}
                                                                        options={patientSource}/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="患者姓名">
                                                        {getFieldDecorator('patientInfo.name', {
                                                            initialValue: patientInfo.name,
                                                            rules: [{
                                                                required: true,
                                                                message: '请填写患者姓名'
                                                            }, {
                                                                pattern: reg_name,
                                                                message: '请输入合法姓名'
                                                            }],
                                                        })(
                                                            <Input type="text" maxLength="5"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="出生日期">
                                                        {getFieldDecorator('patientInfo.birthday', {
                                                            initialValue: patientInfo.birthday && moment(patientInfo.birthday),
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择出生日期'
                                                            }],
                                                        })(
                                                            <DatePicker style={{'width': '100%'}}
                                                                        onChange={(v) => this.changePicker(v)}
                                                                        disabled={this.state.birthStatus}/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="患者年龄">
                                                        {getFieldDecorator('patientInfo.age', {
                                                            initialValue: patientInfo.age,
                                                        })(
                                                            <Input type="number" disabled={this.state.ageStatus}
                                                                   onChange={(v) => this.changeAge(v)} min="0"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={10} md={10} xl={6}>
                                                    <FormItem {...radioItemLayout} label="患者性别">
                                                        {getFieldDecorator('patientInfo.sex', {
                                                            initialValue: patientInfo.sex,
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择患者性别'
                                                            }],
                                                        })(
                                                            <RadioGroup name="sex" options={sex}/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="联系电话">
                                                        {getFieldDecorator('patientInfo.contactPhone', {
                                                            initialValue: patientInfo.contactPhone,
                                                            rules: [{
                                                                required: true,
                                                                message: '请填写联系电话'
                                                            }, {
                                                                pattern: reg_phone,
                                                                message: '请输入正确的手机号码'
                                                            }
                                                            ],
                                                        })(
                                                            <Input type="number"/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="身份证号">
                                                        {getFieldDecorator('patientInfo.idCard', {
                                                            initialValue: patientInfo.idCard,
                                                            rules: [{
                                                                pattern: reg_idCard,
                                                                message: '请输入正确的身份证号'
                                                            }]
                                                        })(
                                                            <Input type="number" onChange={(e) => this.checkIdCard(e)}/>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            <Row gutter={16}>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="个人职业">
                                                        {getFieldDecorator('patientInfo.job', {
                                                            initialValue: patientInfo.job && patientInfo.job.toString(),
                                                        })(
                                                            <Select>
                                                                {jobType}
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="婚姻状况">
                                                        {getFieldDecorator('patientInfo.isMarried', {
                                                            initialValue: patientInfo.isMarried && patientInfo.isMarried.toString(),
                                                        })(
                                                            <Select>
                                                                {isMarried}
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="支付方式">
                                                        {getFieldDecorator('patientAddedDTO.payType', {
                                                            initialValue: patientAddedDTO.payType && patientAddedDTO.payType.toString(),
                                                        })(
                                                            <Select>
                                                                {expenseCategory}
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="医保编号">
                                                        {getFieldDecorator('patientAddedDTO.medicalCard', {
                                                            initialValue: patientAddedDTO.medicalCard,
                                                        })(
                                                            <Input type="text" />
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-10'>
                        <Col span={24}>
                            <div className="contain">
                                <div className="patient-info">
                                    <div className="toolbar">
                                        <div className="title"><span></span>就诊信息</div>
                                        <div className="clearfix"></div>
                                    </div>
                                    <hr/>
                                    <Row className="info-content">
                                        <div className="form-area">
                                            <Row gutter={16}>
                                                <Col lg={8} md={8} xl={6}>
                                                    <FormItem {...formItemLayout} label="病人类型">
                                                        {getFieldDecorator('patientAddedDTO.patientType', {
                                                            initialValue: patientAddedDTO.patientType && patientAddedDTO.patientType.toString(),
                                                            rules: [{
                                                                required: true,
                                                                message: '请选择病人类型'
                                                            }],
                                                        })(
                                                            <Select onChange={(v) => this.changeType(v)}>
                                                                {patientType}
                                                            </Select>
                                                        )}
                                                    </FormItem>
                                                </Col>
                                            </Row>
                                            {this.state.patientType == '1' ? outType : inType}
                                        </div>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div className="btnposition">
                            <button type="submit" className="lm-circleBtn mr-10">
                                保存
                            </button>
                            <button type="button" onClick={() => {
                                window.history.back()
                            }} className="lm-circleBtn-opcity-nb">
                                取消
                            </button>
                        </div>
                    </Row>
                </Form>
            </div>
        );
    }
}


export default Form.create()(Main);