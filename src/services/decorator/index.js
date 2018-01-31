/**
 * Created by j_bleach on 2018/1/31.
 */

import PureRenderMixin from 'react-addons-pure-render-mixin';
function PureRender() {
    return function (target) {
        target.prototype.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(target);
    }
}

export {PureRender}