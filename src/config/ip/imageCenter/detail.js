/**
 * Created by j_bleach on 2017/9/9.
 */

import {imageIp} from '../ip'

const urls = {
    imgList: 'image/center/images/list',
    imgDetail:'image/center/series/list',
    exportId:'image/center/study/export',
    download:'files/export/status',
}

for (let attr in urls) {
    urls[attr] = imageIp + urls[attr]
}

export default urls;