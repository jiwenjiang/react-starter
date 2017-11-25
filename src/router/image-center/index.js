/**
 * Created by j_bleach on 2017/11/6.
 */

const home = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/home/homeIndex').default)
    }, 'home');
}
const image = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/home/image').default)
    }, 'image');
}
const detail = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/home/detail').default)
    }, 'detail');
}
const download = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/home/download').default)
    }, 'download');
}

export {home, image, detail, download}