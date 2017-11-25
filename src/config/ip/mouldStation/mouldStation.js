/**
 * Created by gong.yao on 2017/11/13.
 */
import {collectIp} from '../ip'

const urls = {
    getArea: 'applyorganization',
    getThyDocs: 'get/radiologydoctors',
    getList: 'process/moudle/moudleList',
    sortList: 'appointment/info',
    dictionary: 'dict/type',
    infoDetail: 'process/moudle/moudledetail',
    mouldRooms: 'process/moudle/moudleroom',
    addError: 'process/tasks/exception/add',
    getErrorList: 'process/moudle/exception',
    appointment: 'appointment',
    arrive: 'arrive',
    makeLineNo: 'LineNo',
    done: 'process/tasks/model',
    getQueueInfo: 'model/schedule/queue',
    getQueue: 'model/schedule/LineList',
    changeStatus: 'model/schedule/status',
    point:'model/schedule/appoint',
    queuePoint:'model/schedule/next'
};

for (let attr in urls) {
    urls[attr] = collectIp + urls[attr]
}

export default urls;