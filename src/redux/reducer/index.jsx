const subTitle = (state = '', action) => {
    switch (action.type) {
        case 'SUB_TITLE':
            return action.item;
        default:
            return state;
    }
}

const patientInfo = (state = {}, action) => {
    switch (action.type) {
        case 'PATIENT_INFO':
            return action.item;
        default:
            return state;
    }
}


export {subTitle, patientInfo};