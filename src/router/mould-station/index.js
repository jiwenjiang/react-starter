/**
 * Created by gong.yao on 2017/11/13.
 */

const mouldStation = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/mouldStation/mouldStation').default)
    }, 'mouldStation');
};

const checkMould = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/mouldStation/checkMould').default)
    }, 'checkMould');
};

const queue = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/mouldStation/queue').default)
    }, 'queue')
}

// const appointList = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../../containers/nurseStation/editPatient').default)
//     }, 'editPatient');
// }
//
// const mouldErrList = (location, cb) => {
//     require.ensure([], require => {
//         cb(null, require('../../containers/nurseStation/checkPatient').default)
//     }, 'checkPatient')
// }

export {mouldStation, checkMould, queue}