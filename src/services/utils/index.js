/**
 * Created by j_bleach on 2017/9/16.
 */
import moment from 'moment';
const isEmptyObject = (v) => {
    let key
    for (key in v) {
        return false;
    }
    return true
}

const countAge = (v) => {
    let age = 0;
    let yearNow = moment().format('YYYY-MM-DD').split('-')[0];
    let yearBirth = moment(v).format('YYYY-MM-DD').split('-')[0];
    if (moment(moment().format('YYYY-MM-DD')).isBefore(moment(v).format('YYYY-MM-DD'), 'day')) {
        age = yearNow - yearBirth - 1;
    }
    else {
        age = yearNow - yearBirth;
    }
    return age
}

export {isEmptyObject, countAge}