import React from 'react'; // react核心
import {Router, Route, Redirect, IndexRoute, browserHistory} from 'react-router'; // 创建route所需
import layout from '../component/common/layout/layout'; // 布局界面
import {home, image, detail, download} from './image-center/';
import {curPatient, editPatient, checkPatient} from './nurse-station/';
import {mouldStation, checkMould, queue} from './mould-station';
import {login} from './about/';

const RouteConfig = (
    <Router history={browserHistory}>
        <Route path="/home" component={layout}>
            <IndexRoute getComponent={home}/>
            <Route path="/home" getComponent={home}>
                <IndexRoute getComponent={image}/>
                <Route path="/home/image" getComponent={image}/>
                <Route path="/home/detail/:id" getComponent={detail}/>
                <Route path="/home/nurseStation/curPatient(/:curTab)" getComponent={curPatient}/>
                <Route path="/home/nurseStation/editPatient/:id" getComponent={editPatient}/>
                <Route path="/home/nurseStation/checkPatient/:id" getComponent={checkPatient}/>
                <Route path="/home/mouldStation/mouldList" getComponent={mouldStation}/>
                <Route path="/home/mouldStation/mouldInfo/:id" getComponent={checkMould}/>
                <Route path="/home/mouldStation/queue" getComponent={queue}/>
            </Route>
        </Route>
        <Route path="/download/:id" getComponent={download}/>
        <Route path="/login" getComponent={login}/>
        {/*<Route path="/home" component={Roots}> // 所有的访问，都跳转到Roots*/}
        {/*<IndexRoute component={layout} /> // 默认加载的组件，比如访问www.test.com,会自动跳转到www.test.com/home*/}
        {/*</Route>*/}
        <Redirect from="*" to="/home/image"/>
    </Router>
);

export default RouteConfig;
