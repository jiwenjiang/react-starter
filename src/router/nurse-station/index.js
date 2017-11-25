/**
 * Created by j_bleach on 2017/11/6.
 */

const curPatient = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/nurseStation/curPatient').default)
    }, 'curPatient');
}

const editPatient = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/nurseStation/editPatient').default)
    }, 'editPatient');
}

const checkPatient = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/nurseStation/checkPatient').default)
    }, 'checkPatient')
}

export {curPatient, editPatient, checkPatient}