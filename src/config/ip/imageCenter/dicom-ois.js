/**
 * Created by j_bleach on 2017/9/30.
 */

import {dicomOis} from '../ip';

const urls = {
    getDevice: 'aeNode/device/select'
}

for (let attr in urls) {
    urls[attr] = dicomOis + urls[attr]
}

export default urls;
