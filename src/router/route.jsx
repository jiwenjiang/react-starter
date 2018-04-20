import React from 'react'; // react核心
import {Router, Route, Redirect, browserHistory} from 'react-router'; // 创建route所需
import {login} from './about/';

const checkLeaveAbout = (prevState) => {
    console.log(prevState);
    return confirm('Are you sure you want to leave this page');
}

const RouteConfig = (
    <Router history={browserHistory}>
        <Route path="/login" onLeave={checkLeaveAbout} getComponent={login}/>
        <Redirect from="*" to="/login"/>
    </Router>
);

export default RouteConfig;
