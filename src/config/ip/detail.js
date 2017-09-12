/**
 * Created by j_bleach on 2017/9/9.
 */

import {imageIp} from './ip'

const urls = {
    imgList: 'images/list',
    imgDetail:'series/list'
}

for (let attr in urls) {
    urls[attr] = imageIp + urls[attr]
}

export default urls;