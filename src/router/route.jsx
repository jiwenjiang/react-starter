import React from 'react'; // react核心
import {Router, Route, Redirect, IndexRoute, browserHistory} from 'react-router'; // 创建route所需
import layout from '../component/common/layout/layout'; // 布局界面
import {home, image, detail, download} from './image-center/';
import {login} from './about/';

const checkLeaveAbout = (prevState) => {
    console.log(prevState);
    return confirm('Are you sure you want to leave this page');
}

const RouteConfig = (
    <Router history={browserHistory}>
        <Route path="/home" component={layout}>
            <IndexRoute getComponent={home}/>
            <Route path="/home" getComponent={home}>
                <IndexRoute getComponent={image}/>
                <Route path="/home/image" getComponent={image}/>
                <Route path="/home/detail/:id" getComponent={detail}/>
            </Route>
        </Route>
        <Route path="/download/:id" getComponent={download}/>
        <Route path="/login" onLeave={checkLeaveAbout} getComponent={login}/>
        <Redirect from="*" to="/login"/>
    </Router>
);

export default RouteConfig;
