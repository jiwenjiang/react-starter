/**
 * Created by j_bleach on 2017/11/6.
 */

const login = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../../containers/login/login').default)
    }, 'login');
}

export {login}