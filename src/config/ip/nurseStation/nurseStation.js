/**
 * Created by gong.yao on 2017/9/30.
 */
import {collectIp} from '../ip'

const urls = {
    dictionary: 'dict/type',
    dictionarys: 'dicts/types',
    getOrg: 'outpatientorg',
    getWards: 'wardorg',
    getDoctors: 'get/area/doctors',
    getNames: 'process/tasks/patients/searchPatient',
    getInfo: 'process/tasks/patients/getPatientInfo',
    getResult: 'treatresult',
    addPatient: 'process/tasks/patients/add',
    getArea: 'process/tasks/patients/organizations',
    getList: 'process/tasks/patients/patientList',
    patientDetail: 'process/tasks/patients/detail',
    delPatient: 'process/tasks/patients/delete',
    uploadFile: 'process/tasks/patients/upload',
    updatePatient: 'process/tasks/patients/update',
    getThyDocs: 'get/radiologydoctors'
};

for (let attr in urls) {
    urls[attr] = collectIp + urls[attr]
}

export default urls;