/**
 * Created by j_bleach on 2017/11/7.
 */

import {IP} from '../ip'

const urls = {
    issues: 'issues'
};

for (let attr in urls) {
    urls[attr] = IP + urls[attr]
}

export default urls;