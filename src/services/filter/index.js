/**
 * Created by j_bleach on 2017/9/12.
 */
import React, {Component} from 'react';

export const sex = (data) => {
    if (!data) {
        return ''
    }
    return {
        1: '女',
        2: '男',
        3: '未知'
    }[data]
}

export const modality = (data) => {
    if (!data) {
        return ''
    }
    let modality = {
        'RTSTRUCT': '#6a73e5',
        'RTDOSE': '#4d58de',
        'RTIMAGE': '#2D38BF',
        'RTPLAN': '#9398e3',
        'CT': '#73a6ee',
        'MR': '#b4de89',
        'PET': '#ee8c8c'
    }[data]
    return modality ? modality : '#408ee6'
}

export const modalityTxt = (data) => {
    if (!data) {
        return ''
    }
    let modality = {
        'RTSTRUCT': 'RS',
        'RTDOSE': 'RD',
        'RTIMAGE': 'RI',
        'RTPLAN': 'RP',
        'CT': 'CT',
        'MR': 'MR',
        'PET': 'PET'
    }[data]
    return modality
}

export const styleHoc = (Copt) => {
    return class extends Component {
        render() {
            return <div style={{color:'green'}}>
                <Copt></Copt>
            </div>
        }
    }
}

