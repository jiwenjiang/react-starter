/**
 * Created by j_bleach on 2017/9/9.
 */

import ip from './ip'

const urls = {
    imgList: 'images/list'
}

for (let attr in urls) {
    urls[attr] = ip + urls[attr]
}

export default urls;