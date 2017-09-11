import React, {Component} from 'react'; // 引入了React和PropTypes

// import {Link} from 'react-router';


// 公共面包屑
import {Bcrumb} from "../../component/bcrumb/bcrumb";


import './style/home.less'
// import {Row,Col} from 'antd';



/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
    }


    render() {
        // let linkHtml = '<link href="/antd/dist/app.css" rel="stylesheet" />';
        return (
            <div className="home-container">
                <Bcrumb />
                {this.props.children}
            </div>
        );
    }
}

export default Main;