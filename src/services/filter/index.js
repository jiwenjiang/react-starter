/**
 * Created by j_bleach on 2017/9/12.
 */

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
        'PET': '#ee8c8c',
        'RTRECORD': '#9a6be8'
    }[data]
    return modality ? modality : '#d8d8d8'
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
        'PET': 'PET',
        'PT': 'PET',
        'RTRECORD': 'RR'
    }[data]
    return modality ? modality : data
}

export const bodyPart = (data) => {
    if (!data) {
        return 'weizhi'
    }
    const arr = ['ABDOMEN', 'PELVIS', 'HEAD']
    return (arr.indexOf(data) === -1 ? 'weizhi' : arr[arr.indexOf(data)])
}



