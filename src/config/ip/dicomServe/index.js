/**
 * Created by j_bleach on 2017/10/10.
 */


import {dicomServe} from '../ip';
const urls = {
    upload: 'scu/store'
}

for (let attr in urls) {
    urls[attr] = dicomServe + urls[attr]
}

export default urls;

