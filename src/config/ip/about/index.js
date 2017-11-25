/**
 * Created by j_bleach on 2017/11/7.
 */

import {collectIp} from '../ip'

const urls = {
    login: 'users/login',
    getOrgs: 'all/organization'
};

for (let attr in urls) {
    urls[attr] = collectIp + urls[attr]
}

export default urls;