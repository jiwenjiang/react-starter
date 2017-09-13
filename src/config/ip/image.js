/**
 * Created by j_bleach on 2017/9/9.
 */

import {collectIp} from './ip'

const urls = {
    imgList: 'get/dicomdata/imagecenter/list',
    addLiked: 'get/dicomdata/favorits/add',
    delLiked: 'get/dicomdata/favorits/cancel',
    likedIds: 'get/dicomdata/favorits/list'
}

for (let attr in urls) {
    urls[attr] = collectIp + urls[attr]
}

export default urls;