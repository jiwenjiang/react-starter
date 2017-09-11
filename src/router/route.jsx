/**
 * 疑惑一：
 * React createClass 和 extends React.Component 有什么区别?
 * 之前写法：
 * let app = React.createClass({
*  	getInitialState: function(){
*    	// some thing
*  	}
*  })
 * ES6写法(通过es6类的继承实现时state的初始化要在constructor中声明)：
 * class exampleComponent extends React.Component {
*    constructor(props) {
*        super(props);
*        this.state = {example: 'example'}
*    }
* }
 */

import React from 'react'; // react核心
import {Router, Route, Redirect, IndexRoute, browserHistory} from 'react-router'; // 创建route所需
// import Config from '../config/index';
import layout from '../component/layout/layout'; // 布局界面


/**
 * (路由根目录组件，显示当前符合条件的组件)
 *
 * @class Roots
 * @extends {Component}
 */
// class Roots extends Component {
//     render() {
//         // 这个组件是一个包裹组件，所有的路由跳转的页面都会以this.props.children的形式加载到本组件下
//         return (
//             <div>{this.props.children}</div>
//         );
//     }
// }

// 快速入门
const home = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/home/homeIndex').default)
    }, 'home');
}
const image = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/home/image').default)
    }, 'image');
}
const collect = (location, cb) => {
    require.ensure([], require => {
        cb(null, require('../containers/home/collect/collect').default)
    }, 'collect');
}

const RouteConfig = (
    <Router history={browserHistory}>
        <Route path="/home" component={layout}>
            <IndexRoute getComponent={home}/>
            <Route path="/home" getComponent={home}>
                <IndexRoute getComponent={image}/>
                <Route path="/home/image" getComponent={image}/>
                <Route path="/home/collect" getComponent={collect}/>
            </Route>
        </Route>
        {/*<Route path="/home" component={Roots}> // 所有的访问，都跳转到Roots*/}
        {/*<IndexRoute component={layout} /> // 默认加载的组件，比如访问www.test.com,会自动跳转到www.test.com/home*/}
        {/*</Route>*/}
        <Redirect from="*" to="/home/image"/>
    </Router>
);

export default RouteConfig;
