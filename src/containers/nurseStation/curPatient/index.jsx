import React, {Component} from 'react';
import {Col, Row, Form, Input, DatePicker, Radio, Select, Modal, Button} from 'antd';
import Moment from 'moment';
import PatientList from '../../../component/nurseStation/patient-list/patient-list'
import PureRenderMixin from 'react-addons-pure-render-mixin';
// import {sex} from '../../../services/filter/index'
import '../../../assets/fonts/iconfont.css';
import {Lmtab} from '../../../component/common/lmtab';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
import {convertBase64ToBlob} from './snapImage';
import url from '../../../config/ip/nurseStation/nurseStation';
import xhr from '../../../services/xhr/index';
import './curPatient.less';

const confirm = Modal.confirm;
const Search = Input.Search;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const patientSource = [{label: '本院', value: 1}, {label: '外院', value: 2}];
const patientType = [<Option key="1">门诊</Option>, <Option key="2">住院</Option>];
let org = [];
let ward = [];
let therapyDoctors = [];
let doctors = [];
let timeout;
let currentValue;
let flag = false;
let flagResult = false;
let validStatus = {};
let canvas;
let video;
let mediaStreamTrack;
let validFlag;
let validImg;


class curPatient extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.convertBase64ToBlob = convertBase64ToBlob.bind(this);
        // this.snapImage = snapImage.bind(this);
        this.state = {
            curTab: this.props.params.curTab || 0,
            nameList: [],
            resultList: [],
            keyword: '',
            keywordResult: '',
            isDisabled: false,
            isAllDisabled: false,
            patientInfo: {},
            patientRegister: {
                patientType: '1',
                applyTime: Moment()
            },
            validFlag: false,
            fileUrl: null,
            file: {},
            previewVisible: false,
            snapVisible: false
        };
    }

    componentDidMount() {
        const titles = [
            {link: '/home/nurseStation/curPatient', text: '护士工作站'}
        ];
        this.props.setTitle(titles);
        this.getOrg();
        this.getWard();
        this.getTherapyDoctors();
        this.dictionary();
    }

    disabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    };

    onTabChange = (i) => {
        switch (i) {
            case 0:
                this.setState({
                    curTab: i,
                    nameList: [],
                    resultList: [],
                    keyword: '',
                    keywordResult: '',
                    isDisabled: false,
                    isAllDisabled: false,
                    patientInfo: {},
                    patientRegister: {
                        patientType: '1',
                        applyTime: Moment()
                    },
                    validFlag: false,
                    fileUrl: null,
                    file: {},
                    previewVisible: false,
                    snapVisible: false
                }, () => {
                    this.getOrg();
                    this.getWard();
                    this.getTherapyDoctors();
                    this.dictionary();
                });
                break;
            case 1:
                this.setState({
                    curTab: i
                })
        }
    };
    dictionary = () => {
        xhr.get(url.dictionarys, {types: 'sex,job_type,is_married,expense_category,therapy_tech'}, (data) => {
            let sex = data.sex && data.sex.map(v => {
                    return {label: v.bdName, value: v.id};
                });
            let jobs = data.jobType && data.jobType.map(v => {
                    return <Option key={v.id}>{v.bdName}</Option>;
                });
            let marrige = data.isMarried && data.isMarried.map(v => {
                    return <Option key={v.id}>{v.bdName}</Option>;
                });
            let payments = data.expenseCategory && data.expenseCategory.map(v => {
                    return <Option key={v.id}>{v.bdName}</Option>;
                });
            let therapyTech = data.therapyTech && data.therapyTech.map(v => {
                    return <Option key={v.id}>{v.bdName}</Option>;
                });
            this.setState({
                dictionary: {
                    sex: sex,
                    jobs: jobs,
                    marrige: marrige,
                    payments: payments,
                    therapyTech: therapyTech
                }
            })
        })
    };
    getOrg = () => {
        // 科室
        xhr.get(url.getOrg, {}, (data) => {
            org = data && data.map(v => {
                    return <Option key={v.id}>{v.name}</Option>;
                });
            this.setState({area: org, org: org})
        })
    };
    getWard = () => {
        // 病区
        xhr.get(url.getWards, {}, (data) => {
            ward = data && data.map(v => {
                    return <Option key={v.id}>{v.name}</Option>;
                });
            this.setState({ward: ward})
        })
    };
    getTherapyDoctors = () => {
        xhr.get(url.getThyDocs, {}, (data) => {
            therapyDoctors = data && data.map(v => {
                    return <Option key={v.doctorId}>{v.doctorName}</Option>
                });
            this.setState({therapyDoctors: therapyDoctors})
        })
    };

    checkIdCard = (e) => {
        validStatus.validIdcard = {};
        let value = e.target.value;
        let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        if (reg.test(value)) {
            let birthdayNum = value.toString().slice(6, 14);
            let birthday = Moment(birthdayNum.slice(0, 4) + '-' + birthdayNum.slice(4, 6) + '-' + birthdayNum.slice(6));
            this.setState({
                isDisabled: true,
                patientInfo: {...this.state.patientInfo, idCard: value}
            }, () => {
                this.pickBirthday(birthday);
            });
        }
        else {
            this.setState({
                    isDisabled: false,
                    patientInfo: {
                        ...this.state.patientInfo,
                        idCard: value
                    }
                }
            )
        }
    };

    pickBirthday = (value) => {
        let age = 0;
        let yearNow = Moment().format('YYYY-MM-DD').split('-')[0];
        let yearBirth = Moment(value).format('YYYY-MM-DD').split('-')[0];
        if (Moment(Moment().format('YYYY-MM-DD')).isBefore(Moment(value).format('YYYY-MM-DD'), 'day')) {
            age = yearNow - yearBirth - 1;
        }
        else {
            age = yearNow - yearBirth;
        }
        this.setState({
            patientInfo: {
                ...this.state.patientInfo,
                birthday: value,
                age: age
            }
        })
    };

    changeAge = (e) => {
        validStatus.validAge = {};
        let value = e.target.value;
        if (value > 200 || value < 0) {
            validStatus.validAge = {validateStatus: 'warning', help: '请填入合理范围的年龄！'};
            this.setState({patientInfo: {...this.state.patientInfo, age: value, birthday: null}});
        }
        else {
            let birthday = Moment().subtract(value, 'y');
            this.setState({
                patientInfo: {
                    ...this.state.patientInfo,
                    birthday: birthday,
                    age: value
                }
            })
        }
    };

    fetch = (value, cb) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        function fake() {
            xhr.get(url.getNames, {patientName: currentValue}, (data) => {
                if (currentValue === value) {
                    const nameList = data && data.map(v => {
                            return {
                                key: v.id,
                                name: v.name + '，' + v.sexName + '，' + v.age + '岁，' + v.contactPhone,
                                value: `${v.name}                                                                      /${v.id}`
                            }
                        });
                    cb(nameList);
                }
            })
        }

        timeout = setTimeout(fake, 500);
    };

    fetchResult = (value, cb) => {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        currentValue = value;

        function fake() {
            xhr.get(url.getResult, {keyWord: currentValue}, (data) => {
                if (currentValue === value) {
                    const resultList = data && data.map(v => {
                            return {
                                key: v.treatResultId,
                                name: v.result,
                                value: v.treatResultId.toString()
                            }
                        });
                    cb(resultList);
                }
            })
        }

        timeout = setTimeout(fake, 500);
    };

    searchName = (value) => {
        validStatus.validName = {};
        let keyword = value.split('/')[0].trim();
        // let keywordId = value.split('/')[1];
        this.setState({
            keyword: keyword,
            patientInfo: {...this.state.patientInfo, name: keyword}
        });
        if (!flag && keyword) {
            this.fetch(keyword, nameList => this.setState({nameList: nameList || []}));
        }
    };

    pickName = (value) => {
        validStatus = {};
        let keywordId = value.split('/')[1];
        flag = true;
        xhr.get(url.getInfo, {patientId: keywordId}, (data) => {
            this.setState({
                isAllDisabled: true,
                nameList: []
            }, () => {
                this.setState({
                    patientInfo: Object.assign({}, data, {
                        job: data.job && data.job.toString(),
                        isMarried: data.isMarried && data.isMarried.toString(),
                        birthday: Moment(data.birthday)
                    }),
                    patientRegister: {
                        patientType: '1',
                        applyTime: Moment()
                    }
                })
            });
        });
    };

    inputTel = (e) => {
        validStatus.validTel = {};
        this.setState({
            patientInfo: {
                ...this.state.patientInfo,
                contactPhone: e.target.value
            }
        })
    };

    choosePayment = (value) => {
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                payType: value
            }
        })
    };

    inputEnsurance = (e) => {
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                medicalCard: e.target.value
            }
        })
    };

    searchResult = (value) => {
        validStatus.validResult = {};
        let keyword = value;
        // this.setState({
        //     keywordResult: keyword
        // });
        if (!flagResult && keyword) {
            this.fetchResult(value, resultList => this.setState({resultList: resultList || []}));
        }
    };

    pickResult = (value) => {
        flagResult = true;
        this.setState({patientRegister: {...this.state.patientRegister, treatResultId: value}})
    };

    chooseSex = (e) => {
        validStatus.validSex = {};
        this.setState({
            patientInfo: {
                ...this.state.patientInfo,
                sex: e.target.value
            }
        })
    };

    chooseSource = (e) => {
        validStatus.validSource = {};
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                patientSource: e.target.value
            }
        })
    };

    chooseJob = (value) => {
        this.setState({
            patientInfo: {
                ...this.state.patientInfo,
                job: value
            }
        })
    };

    chooseMarrige = (value) => {
        this.setState({
            patientInfo: {
                ...this.state.patientInfo,
                isMarried: value
            }

        })
    };

    chooseType = (value) => {
        flagResult = false;
        validStatus = {};
        if (value == 1) {
            this.setState({
                area: this.state.org, doctors: [], patientRegister: {
                    patientType: value,
                    applyTime: Moment()
                }
            })
        }
        else {
            this.setState({
                area: this.state.ward, doctors: [], patientRegister: {
                    patientType: value,
                    applyTime: Moment()
                }
            })
        }
    };

    pickRegisterTime = (value) => {
        console.log(this.state.patientRegister);
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                registerTime: value
            }
        }, () => {
            console.log(this.state)
        })
    };

    chooseOrg = (value) => {
        validStatus.validArea = {};
        xhr.get(url.getDoctors, {areaId: value}, (data) => {
            doctors = data && data.map(v => {
                    return <Option key={v.doctorId}>{v.doctorName}</Option>
                });
            this.setState({
                doctors: doctors,
                patientRegister: {
                    ...this.state.patientRegister,
                    areaId: value,
                    doctorId: null,
                    applyDoctorId: null
                }
            });
        })
    };

    chooseDoctor = (value) => {
        validStatus.validDoctor = {};
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                doctorId: value
            }
        })
    };

    chooseApplyDoctor = (value) => {
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                applyDoctorId: value
            }
        })
    };

    chooseTherapyDoctor = (value) => {
        validStatus.validTherapy = {};
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                radiotherapyDoctorId: value
            }
        })
    };

    chooseTherapyTech = (value) => {
        console.log(this.state.patientRegister);
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                iatrotechniqueId: value
            }
        })
    };

    inputBedNo = (e) => {
        validStatus.validBedNo = {};
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                bedNo: e.target.value
            }
        })
    };

    inputNo = (e) => {
        validStatus.validHospitalNo = {};
        this.setState({
            patientRegister: {
                ...this.state.patientRegister,
                hospitalNo: e.target.value
            }
        })
    };

    chackTel = (e) => {
        console.log(e.target.value)
        let reg = new RegExp(/(^1[0-9]{10}$)/);
        if (e.target.value) {
            if (!reg.test(e.target.value)) {
                validStatus = {};
                validStatus.validTel = '请填写正确的格式！'
                this.forceUpdate();
            }
        }
    };

    showConfirm = () => {
        confirm({
            title: '确认',
            content: '确认要清空所有信息吗？',
            onOk: () => {
                flag = false;
                this.setState({
                    nameList: [],
                    resultList: [],
                    keyword: '',
                    keywordResult: '',
                    isDisabled: false,
                    isAllDisabled: false,
                    patientInfo: {},
                    patientRegister: {
                        patientType: '1',
                        applyTime: Moment()
                    }
                })
            }
        });
    };

    handleSubmit = () => {
        validStatus = {};
        validFlag = true;
        let validRule = {
            required: {
                validateStatus: 'error',
                help: '此项必填！'
            },
            type: {
                validateStatus: 'error',
                help: '请填写正确的格式！'
            }
        };
        let patientAddedDTO = {
            isMarried: this.state.patientInfo.isMarried,
            job: this.state.patientInfo.job, ...this.state.patientRegister
        };
        let patient = {
            patientInfo: this.state.patientInfo,
            patientAddedDTO: patientAddedDTO
        };

        if (patient.patientAddedDTO.patientSource === undefined) {
            validStatus.validSource = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (!patient.patientInfo.name) {
            validStatus.validName = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (patient.patientInfo.name) {
            let regName = /^[\u4E00-\u9FA5A-Za-z]+$/;
            if (!regName.test(patient.patientInfo.name)) {
                validStatus.validName = validRule.type;
                validFlag = false;
                this.forceUpdate();
            }
            if (patient.patientInfo.name.length > 20) {
                validStatus.validName = {validateStatus: 'warning', help: '过长的姓名！请保持在20个字符长度以内。'};
                validFlag = false;
                this.forceUpdate();
            }
        }
        if (!patient.patientInfo.sex) {
            validStatus.validSex = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (patient.patientInfo.age == undefined) {
            validStatus.validAge = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (!patient.patientInfo.contactPhone) {
            validStatus.validTel = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        // if(patient.patientAddedDTO.medicalCard){
        //     let regInsurance = /(^[0-9]*$)/;
        //     if(!regInsurance.test(patient.patientAddedDTO.medicalCard)){
        //         validStatus.validInsurance = {validateStatus: 'warning', help: '编号为'}
        //         this.setState({validFlag: !this.state.validFlag});
        //         return;
        //     }
        // }
        if (!patient.patientAddedDTO.areaId) {
            validStatus.validArea = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (!patient.patientAddedDTO.doctorId) {
            validStatus.validDoctor = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (!patient.patientAddedDTO.radiotherapyDoctorId) {
            validStatus.validTherapy = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (patient.patientAddedDTO.patientType == 2 && !patient.patientAddedDTO.bedNo) {
            validStatus.validBedNo = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (!patient.patientAddedDTO.treatResultId) {
            validStatus.validResult = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (!patient.patientAddedDTO.hospitalNo) {
            validStatus.validHospitalNo = validRule.required;
            validFlag = false;
            this.forceUpdate();
        }
        if (patient.patientInfo.idCard) {
            let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
            if (!reg.test(patient.patientInfo.idCard)) {
                validStatus.validIdcard = validRule.type;
                validFlag = false;
                this.forceUpdate();
            }
        }
        if (patient.patientInfo.contactPhone) {
            let reg = /(^1[0-9]{10}$)/;
            if (!reg.test(patient.patientInfo.contactPhone)) {
                validStatus.validTel = validRule.type;
                validFlag = false;
                this.forceUpdate();
            }
        }
        patient.patientInfo.isMarried = null;
        patient.patientInfo.job = null;
        patient.patientInfo.age = parseInt(patient.patientInfo.age);
        if (validFlag == true && !validImg) {
            xhr.post(url.addPatient, patient, (data) => {
                if (this.state.fileUrl && this.state.fileUrl.length != 0) {
                    let file = new FormData();
                    if (this.state.fileUrl.indexOf('base64') == -1) {
                        file.append('file', this.state.file);
                        file.append('patientId', data);
                    }
                    else {
                        file.append('file', this.convertBase64ToBlob(this.state.fileUrl));
                        file.append('patientId', data);
                    }
                    xhr.post(url.uploadFile, file, () => {
                        flag = false;
                        flagResult = false;
                        this.setState({
                            nameList: [],
                            resultList: [],
                            keyword: '',
                            keywordResult: '',
                            isDisabled: false,
                            isAllDisabled: false,
                            patientInfo: {},
                            patientRegister: {
                                patientType: '1',
                                applyTime: Moment()
                            },
                            validFlag: false,
                            fileUrl: null,
                            file: {},
                            previewVisible: false,
                            snapVisible: false,
                            doctors: []
                        });
                    }, {headers: {'Content-Type': 'multipart/form-data'}})
                }
                else {
                    flag = false;
                    flagResult = false;
                    this.setState({
                        nameList: [],
                        resultList: [],
                        keyword: '',
                        keywordResult: '',
                        isDisabled: false,
                        isAllDisabled: false,
                        patientInfo: {},
                        patientRegister: {
                            patientType: '1',
                            applyTime: Moment()
                        },
                        validFlag: false,
                        fileUrl: null,
                        file: {},
                        previewVisible: false,
                        doctors: []
                    });
                }

            });
        }
    };

    handleFile = (e) => {
        let file = e.target.files;
        validImg = false;
        this.setState({
            upfile: false
        })
        if (file.length === 0) return;
        if (file[0].size > 5 * 1024 * 1024) {
            validImg = true;
            this.setState({
                upfile: true
            })
        }
        this.setState({fileUrl: window.URL.createObjectURL(file[0]), file: file[0]})
    };

    snapImage() {

        video = this.refs.video;
        // canvas = this.refs.canvas;
        let getMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({
                video: true
            }).then(stream => {
                mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0];
                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }).catch(err => {
                console.log(err)
            })
        }
        else if (getMedia) {
            navigator.getMedia({
                video: true
            }, (stream) => {
                mediaStreamTrack = stream.getTracks()[0];
                video.src = (window.URL || window.webkitURL).createObjectURL(stream);
                video.play();
            }, (err) => {
                console.log(err)
            });
        }
        this.setState({snapVisible: true})
    }

    handlePreview = () => {
        this.setState({previewVisible: true})
    };

    handleCancel = () => {
        this.setState({previewVisible: false})
    };

    snapHeadImg = () => {
        canvas = this.refs.canvas;
        let context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, 200, 150);
    };

    getSnap = () => {
        mediaStreamTrack && mediaStreamTrack.stop();
        this.setState({fileUrl: canvas.toDataURL('image/png'), snapVisible: false})
    };

    cancelSnap = () => {
        mediaStreamTrack && mediaStreamTrack.stop();
        this.setState({snapVisible: false})
    };

    entry = (e) => {
        if(e.keyCode==13){
           e.preventDefault();
        }
    }

    render = () => {
        const names = this.state.nameList.map(v => <Option key={v.key} value={v.value}>{v.name}</Option>);
        const results = this.state.resultList.map(v => <Option key={v.key} value={v.value}>{v.name}</Option>);
        const formItemLayout = {
            labelCol: {
                xl: {span: 7, offset: '6px'},
                lg: {span: 7},
                md: {span: 4},
                sm: {span: 4},
                xs: {span: 4}
            },
            wrapperCol: {
                xl: {span: 17},
                lg: {span: 17},
                md: {span: 20},
                sm: {span: 20},
                xs: {span: 20}
            }
        };
        const tabone = <div className="panel-content">
            <Form onKeyDown={this.entry}>
                <div className="addPatient" style={{marginTop: 20}}>
                    <Row>
                        <Col span={24}>
                            <div className="patient-info">
                                <div className="toolbar">
                                    <div className="title"><span></span>患者信息</div>
                                    <div className="tools">
                                        <Search
                                            placeholder="HIS编号搜索…"
                                            style={{width: 200, height: 34}}
                                        />
                                    </div>
                                    <div className="clearfix"></div>
                                </div>
                                <hr/>
                                <Row className="info-content">
                                    <Col xl={3} lg={4} md={24} sm={24} xs={24}>
                                        <div className="photo-area">
                                            <div className="photo">
                                                {this.state.fileUrl ? <img id="imageFile" src={this.state.fileUrl}
                                                                           onClick={this.handlePreview}/> :
                                                    <i className="iconfont icon-geren-"></i>}
                                            </div>
                                            <div className="operation">
                                                <button className="link-btn-n" onClick={() => this.snapImage()}>拍摄照片
                                                </button>
                                                <button className="link-btn-u uploadBtn" onClick={() => {
                                                    this.refs.file.click()
                                                }}>上传照片
                                                </button>
                                                <input type="file" ref="file" onChange={this.handleFile}
                                                       accept="image/jpeg,image/png,image/gif"/>
                                                {this.state.upfile
                                                    ? <p style={{fontSize: '12px', color: '#f04134', marginTop: '0px'}}>
                                                        图片超过限制大小5M</p>
                                                    : false
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xl={20} lg={20} md={24} sm={24} xs={24}>
                                        <Row>
                                            <div className="form-area">
                                                <Row>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem {...validStatus.validSource} {...formItemLayout}
                                                                  label={<span><span
                                                                      style={{'color': 'red'}}>*</span><span>患者来源</span></span>}
                                                                  ref="source">
                                                            <RadioGroup name="patientSource"
                                                                        onChange={this.chooseSource}
                                                                        value={this.state.patientRegister.patientSource}
                                                                        options={patientSource}/>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem
                                                            label={<span><span style={{'color': 'red'}}>*</span><span>放疗编号</span></span>} {...formItemLayout}>
                                                            <Input placeholder="点击保存自动生成"
                                                                //style={{width: 202, height: 34}}
                                                                   disabled={true}/>
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem {...validStatus.validName} label={<span><span
                                                            style={{'color': 'red'}}>*</span><span>患者姓名</span></span>} {...formItemLayout}>
                                                            <Select
                                                                mode="combobox"
                                                                value={this.state.patientInfo.name}
                                                                placeholder="输入关键字可查询"
                                                                ref="name"
                                                                //style={{width: 202, height: 34}}
                                                                disabled={this.state.isAllDisabled}
                                                                showArrow={false}
                                                                filterOption={false}
                                                                onChange={this.searchName}
                                                                onSelect={this.pickName}
                                                            >
                                                                {names}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem label="出生日期" {...formItemLayout}>
                                                            <DatePicker
                                                                disabledDate={this.disabledDate}
                                                                style={{width: '100%'}}
                                                                placeholder="输入格式如‘2000-01-01’"
                                                                ref="birthday"
                                                                disabled={this.state.isDisabled || this.state.isAllDisabled}
                                                                onChange={this.pickBirthday}
                                                                value={this.state.patientInfo.birthday}
                                                            />
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem {...validStatus.validAge} label={<span><span
                                                            style={{'color': 'red'}}>*</span><span>患者年龄</span></span>} {...formItemLayout}>
                                                            <Input //style={{width: 202, height: 34}}
                                                                ref="age"
                                                                value={this.state.patientInfo.age} type="number"
                                                                disabled={this.state.isDisabled || this.state.isAllDisabled}
                                                                onChange={this.changeAge}/>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem {...validStatus.validSex} label={<span><span
                                                            style={{'color': 'red'}}>*</span><span>患者性别</span></span>} {...formItemLayout}>
                                                            <RadioGroup name="sex" disabled={this.state.isAllDisabled}
                                                                        onChange={this.chooseSex}
                                                                        value={this.state.patientInfo.sex}
                                                                        options={this.state.dictionary && this.state.dictionary.sex}/>
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem {...validStatus.validTel} label={<span><span
                                                            style={{'color': 'red'}}>*</span><span>联系电话</span></span>} {...formItemLayout}>
                                                            <Input
                                                                //style={{width: 202, height: 34}}
                                                                type="number"
                                                                onChange={this.inputTel}
                                                                onBlur={this.chackTel}
                                                                value={this.state.patientInfo.contactPhone}
                                                                disabled={this.state.isAllDisabled}/>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem {...validStatus.validIdcard}
                                                                  label="身份证号" {...formItemLayout}>
                                                            <Input
                                                                //style={{width: 202, height: 34}}
                                                                ref="idCard" type="number"
                                                                value={this.state.patientInfo.idCard}
                                                                disabled={this.state.isAllDisabled}
                                                                onChange={this.checkIdCard}/>
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem label="个人职业" {...formItemLayout}>
                                                            <Select
                                                                //style={{width: 202, height: 34}}
                                                                value={this.state.patientInfo.job}
                                                                onSelect={this.chooseJob}
                                                                disabled={this.state.isAllDisabled}>
                                                                {this.state.dictionary && this.state.dictionary.jobs}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem label="婚姻状况" {...formItemLayout}>
                                                            <Select
                                                                //style={{width: 202, height: 34}}
                                                                value={this.state.patientInfo.isMarried}
                                                                disabled={this.state.isAllDisabled}
                                                                onSelect={this.chooseMarrige}
                                                            >
                                                                {this.state.dictionary && this.state.dictionary.marrige}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem label="支付方式" {...formItemLayout}>
                                                            <Select
                                                                onSelect={this.choosePayment}
                                                                //style={{width: 202, height: 34}}
                                                                disabled={this.state.isAllDisabled}>
                                                                {this.state.dictionary && this.state.dictionary.payments}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col lg={8} xl={6}>
                                                        <FormItem label="医保编号" {...formItemLayout}>
                                                            <Input
                                                                onChange={this.inputEnsurance} type="number"
                                                                //style={{width: 202, height: 34}}
                                                                disabled={this.state.isAllDisabled}/>
                                                        </FormItem>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="addPatient" style={{marginTop: 10}}>
                    <Row>
                        <Col span={24}>
                            <div className="patient-info">
                                <div className="toolbar">
                                    <div className="title"><span></span>就诊信息</div>
                                </div>
                                <hr/>
                                <Row className="info-content">
                                    <div className="form-area" style={{marginTop: 10}}>

                                        <Row>
                                            <Col lg={8} xl={6}>
                                                <FormItem label={<span><span
                                                    style={{'color': 'red'}}>*</span><span>病人类型</span></span>} {...formItemLayout}>
                                                    <Select
                                                        //style={{width: 202, height: 34}}
                                                        value={this.state.patientRegister.patientType}
                                                        onChange={this.chooseType}>
                                                        {patientType}
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                        </Row>
                                        {
                                            this.state.patientRegister.patientType == 1 ?
                                                (
                                                    <div>
                                                        <Row>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem {...validStatus.validArea} label={<span><span
                                                                    style={{'color': 'red'}}>*</span><span>门诊科室</span></span>} {...formItemLayout}>
                                                                    <Select showSearch
                                                                        //style={{width: 202, height: 34}}
                                                                            searchPlaceholder="输入关键词"
                                                                            optionFilterProp="children"
                                                                            value={this.state.patientRegister.areaId}
                                                                            onSelect={this.chooseOrg}>
                                                                        {this.state.area}
                                                                    </Select>
                                                                </FormItem>
                                                            </Col>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem {...validStatus.validHospitalNo}
                                                                          label={<span><span
                                                                              style={{'color': 'red'}}>*</span><span>门诊编号</span></span>} {...formItemLayout}>
                                                                    <Input value={this.state.patientRegister.hospitalNo}
                                                                           onChange={this.inputNo}/>
                                                                </FormItem>
                                                            </Col>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem label="就诊日期" {...formItemLayout}>
                                                                    <DatePicker
                                                                        disabeldDate={this.disabledDate}
                                                                        value={this.state.patientRegister.registerTime}
                                                                        onChange={this.pickRegisterTime}
                                                                        style={{width: '100%'}}
                                                                        placeholder="输入格式如‘2000-01-01’"
                                                                    />
                                                                </FormItem>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem {...validStatus.validDoctor}
                                                                          label={<span><span
                                                                              style={{'color': 'red'}}>*</span><span>门诊医生</span></span>} {...formItemLayout}>
                                                                    <Select showSearch
                                                                        //style={{width: 202, height: 34}}
                                                                            value={this.state.patientRegister.doctorId}
                                                                            optionFilterProp="children"
                                                                            onSelect={this.chooseDoctor}>
                                                                        {this.state.doctors}
                                                                    </Select>
                                                                </FormItem>
                                                            </Col>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem label="申请医生" {...formItemLayout}>
                                                                    <Select showSearch
                                                                            value={this.state.patientRegister.applyDoctorId}
                                                                        //style={{width: 202, height: 34}}
                                                                            optionFilterProp="children"
                                                                            onSelect={this.chooseApplyDoctor}>
                                                                        {this.state.doctors}
                                                                    </Select>
                                                                </FormItem>
                                                            </Col>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem label="申请日期" {...formItemLayout}>
                                                                    <DatePicker
                                                                        disabled={true}
                                                                        value={this.state.patientRegister.applyTime}
                                                                        style={{width: '100%'}}
                                                                    />
                                                                </FormItem>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem {...validStatus.validTherapy}
                                                                          label={<span><span
                                                                              style={{'color': 'red'}}>*</span><span>放疗医生</span></span>} {...formItemLayout}>
                                                                    <Select showSearch optionFilterProp="children"
                                                                            value={this.state.patientRegister.radiotherapyDoctorId}
                                                                        //style={{width: 202, height: 34}}
                                                                            onSelect={this.chooseTherapyDoctor}
                                                                    >
                                                                        {this.state.therapyDoctors}
                                                                    </Select>
                                                                </FormItem>
                                                            </Col>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem label="治疗技术" {...formItemLayout}>
                                                                    <Select showSearch
                                                                            value={this.state.patientRegister.iatrotechniqueId}
                                                                        //style={{width: 202, height: 34}}
                                                                            optionFilterProp="children"
                                                                            onSelect={this.chooseTherapyTech}>
                                                                        {this.state.dictionary && this.state.dictionary.therapyTech}
                                                                    </Select>
                                                                </FormItem>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg={8} xl={6}>
                                                                <FormItem {...validStatus.validResult}
                                                                          label={<span><span
                                                                              style={{'color': 'red'}}>*</span><span>诊疗结果</span></span>} {...formItemLayout}>
                                                                    <Select
                                                                        showSearch
                                                                        value={this.state.patientRegister.treatResultId}
                                                                        placeholder="输入关键字，并从列表中选择ICD-10"
                                                                        ref="result"
                                                                        showArrow={false}
                                                                        optionFilterProp="children"
                                                                        onSearch={this.searchResult}
                                                                        onSelect={this.pickResult}
                                                                    >
                                                                        {results}
                                                                    </Select>
                                                                </FormItem>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                ) : (
                                                <div>
                                                    <Row>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem {...validStatus.validArea} label={<span><span
                                                                style={{'color': 'red'}}>*</span><span>住院病区</span></span>} {...formItemLayout}>
                                                                <Select showSearch
                                                                    //style={{width: 202, height: 34}}
                                                                        value={this.state.patientRegister.areaId}
                                                                        optionFilterProp="children"
                                                                        onSelect={this.chooseOrg}>
                                                                    {this.state.area}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem {...validStatus.validHospitalNo}
                                                                      label={<span><span
                                                                          style={{'color': 'red'}}>*</span><span>住院编号</span></span>} {...formItemLayout}>
                                                                <Input value={this.state.patientRegister.hospitalNo}
                                                                       onChange={this.inputNo}/>
                                                            </FormItem>
                                                        </Col>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem label="入院日期" {...formItemLayout}>
                                                                <DatePicker
                                                                    disabeldDate={this.disabledDate}
                                                                    value={this.state.patientRegister.registerTime}
                                                                    onChange={this.pickRegisterTime}
                                                                    style={{width: '100%'}}
                                                                    placeholder="输入格式如‘2000-01-01’"
                                                                />
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem {...validStatus.validDoctor} label={<span><span
                                                                style={{'color': 'red'}}>*</span><span>主管医生</span></span>} {...formItemLayout}>
                                                                <Select showSearch
                                                                        value={this.state.patientRegister.doctorId}
                                                                    //style={{width: 202, height: 34}}
                                                                        optionFilterProp="children"
                                                                        onSelect={this.chooseDoctor}>
                                                                    {this.state.doctors}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem label="申请医生" {...formItemLayout}>
                                                                <Select showSearch
                                                                        value={this.state.patientRegister.applyDoctorId}
                                                                        optionFilterProp="children"
                                                                        onSelect={this.chooseApplyDoctor}>
                                                                    {this.state.doctors}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem label="申请日期" {...formItemLayout}>
                                                                <DatePicker
                                                                    disabled={true}
                                                                    value={this.state.patientRegister.applyTime}
                                                                    style={{width: '100%', height: 34}}
                                                                />
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem {...validStatus.validTherapy} label={<span><span
                                                                style={{'color': 'red'}}>*</span><span>放疗医生</span></span>} {...formItemLayout}>
                                                                <Select showSearch onSelect={this.chooseTherapyDoctor}
                                                                        value={this.state.patientRegister.radiotherapyDoctorId}
                                                                    //style={{width: 202, height: 34}}
                                                                        optionFilterProp="children">
                                                                    {this.state.therapyDoctors}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem label="治疗技术" {...formItemLayout}>
                                                                <Select showSearch
                                                                        value={this.state.patientRegister.iatrotechniqueId}
                                                                    //style={{width: 202, height: 34}}
                                                                        optionFilterProp="children"
                                                                        onSelect={this.chooseTherapyTech}>
                                                                    {this.state.dictionary && this.state.dictionary.therapyTech}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem {...validStatus.validBedNo} label={<span><span
                                                                style={{'color': 'red'}}>*</span><span>住院床号</span></span>} {...formItemLayout}>
                                                                <Input value={this.state.patientRegister.bedNo}
                                                                       onChange={this.inputBedNo}/>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col lg={8} xl={6}>
                                                            <FormItem {...validStatus.validResult} label={<span><span
                                                                style={{'color': 'red'}}>*</span><span>诊疗结果</span></span>} {...formItemLayout}>
                                                                <Select
                                                                    showSearch
                                                                    value={this.state.patientRegister.treatResultId}
                                                                    placeholder="输入关键字，并从列表中选择"
                                                                    ref="result"
                                                                    showArrow={false}
                                                                    optionFilterProp="children"
                                                                    onSearch={this.searchResult}
                                                                    onSelect={this.pickResult}
                                                                >
                                                                    {results}
                                                                </Select>

                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            )
                                        }

                                    </div>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="op-area" style={{margin: 20}}>
                    <button className="link-btn-o" type="submit" onClick={this.handleSubmit}>保存</button>
                    <button className="link-btn-cancel" onClick={this.showConfirm}>清空</button>
                </div>
                <div className="clearfix"></div>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img src={this.state.fileUrl} style={{width: '100%'}}/>
                </Modal>
                <Modal visible={this.state.snapVisible} title="拍取头像"
                       onOk={this.getSnap} onCancel={this.cancelSnap}
                       footer={[
                           <Button key="cancel" size="large" onClick={this.cancelSnap}>取消</Button>,
                           <Button key="snap" size="large" type="primary" onClick={this.snapHeadImg}>拍照</Button>,
                           <Button key="submit" size="large" type="primary" onClick={this.getSnap}>确定</Button>
                       ]}>
                    {mediaStreamTrack ? (
                        <div>
                            <video ref="video" style={{width: 200, height: 150}}></video>
                            <canvas ref="canvas" style={{width: 200, height: 150}}></canvas>
                        </div>
                    ) : ('没有检测到摄像头。')}

                </Modal>
            </Form>
        </div>
        const tabtwo = <div className="panel-content">
            <PatientList state={this.state}></PatientList>
        </div>
        // const { getFieldDecorator } = this.props.form;
        return (
            <div className="curPatient">
                <div className="tab">
                    <Lmtab tabs={['登记患者', '患者列表']} changeTab={(i) => this.onTabChange(i)} curTab={this.state.curTab}/>
                </div>
                {this.state.curTab == 0 ? tabone : tabtwo}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setTitle: subTitle
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(curPatient);