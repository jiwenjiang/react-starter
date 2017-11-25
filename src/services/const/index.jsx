import React from 'react';
import {Select} from 'antd';
const [Option] = [Select.Option];

const patientSource = [{label: '本院', value: 1}, {label: '外院', value: 2}];
const patientType = [<Option key={1}>门诊</Option>, <Option key={2}>住院</Option>];
const formItemLayout = {
    labelCol: {
        xl: {span: 6},
        lg: {span: 8},
        md: {span: 10},
        sm: {span: 4},
        xs: {span: 4}
    },
    wrapperCol: {
        xl: {span: 18},
        lg: {span: 16},
        md: {span: 14},
        sm: {span: 20},
        xs: {span: 20}
    }
};
const radioItemLayout = {
    labelCol: {
        xl: {span: 6},
        lg: {span: 7},
        md: {span: 8},
        sm: {span: 4},
        xs: {span: 4}
    },
    wrapperCol: {
        xl: {span: 18},
        lg: {span: 17},
        md: {span: 16},
        sm: {span: 20},
        xs: {span: 20}
    }
};
const mouldTHead = [
    {
        title: '部位',
        dataIndex: 'modelPart',
        key: 'modelPart'
    },
    {
        title: '体位',
        dataIndex: 'modelName',
        key: 'modelName'
    },
    {
        title: '附件',
        dataIndex: 'modelAdjunctName',
        key: 'modelAdjunctName'
    },
    {
        title: '组织补偿物',
        dataIndex: 'tissueCompensatorName',
        key: 'tissueCompensatorName'
    }
];
// mould time period
let mouldTimePeriod = [
    <Option key={'1'}>8:00-8:30</Option>,
    <Option key={'2'}>8:30-9:00</Option>,
    <Option key={'3'}>9:00-9:30</Option>,
    <Option key={'4'}>9:30-10:00</Option>,
    <Option key={'5'}>10:00-10:30</Option>,
    <Option key={'6'}>10:30-11:00</Option>,
    <Option key={'7'}>11:00-11:30</Option>,
    <Option key={'8'}>11:30-12:00</Option>,
    <Option key={'9'}>14:00-14:30</Option>,
    <Option key={'10'}>14:30-15:00</Option>,
    <Option key={'11'}>15:00-15:30</Option>,
    <Option key={'12'}>15:30-16:00</Option>,
    <Option key={'13'}>16:00-16:30</Option>,
    <Option key={'14'}>16:00-17:00</Option>
]


export {patientSource, patientType, formItemLayout, radioItemLayout, mouldTHead, mouldTimePeriod}