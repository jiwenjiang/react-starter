/**
 * Created by j_bleach on 2017/9/9.
 */

import ip from './ip'

const urls = {
    imgList: 'get/dicomdata/imagecenter/list',
    addLiked: 'get/dicomdata/favorits/add',
    delLiked: 'get/dicomdata/favorits/cancel',
    imgDetail:'series/list'
}

for (let attr in urls) {
    urls[attr] = ip + urls[attr]
}

export default urls;