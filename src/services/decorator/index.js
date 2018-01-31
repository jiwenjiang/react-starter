/**
 * Created by j_bleach on 2018/1/31.
 */

import PureRenderMixin from 'react-addons-pure-render-mixin';

const PureRender = () => (target) => {
    Object.assign(target.prototype, PureRenderMixin)
}

export {PureRender}