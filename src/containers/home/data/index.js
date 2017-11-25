/**
 * Created by j_bleach on 2017/9/12.
 */
import './data.less'
import React from 'react';
import {modality, modalityTxt} from '../../../services/filter';
export const SeriesHeads = [
    {
        title: '序列ID',
        dataIndex: 'id'
    },
    {
        title: '模态',
        dataIndex: 'modality',
        render: text => <span className="modalityTag"
                              style={{backgroundColor: modality(text)}}>{modalityTxt(text)}</span>,
    },
    {
        title: '检查时间',
        dataIndex: 'seriesCheckTime'
    },
    {
        title: '层数',
        dataIndex: 'numInstances'
    },
    {
        title: '说明',
        dataIndex: 'seriesDesc'
    }
];
