import React, {Component} from 'react'; // 引入了React和PropTypes

// import {Link} from 'react-router';


// 公共面包屑
import {Bcrumb} from '../../component/bcrumb/bcrumb';


import './style/home.less'
// import {Row,Col} from 'antd';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subtitle: 'bleach',
            status: 0
        };

    }

    componentDidMount() {
        // console.log(this.refs.a);
        // let a = {'a': 1}
        // Reflect.deleteProperty(this.refs.a.props, 'title');
        // delete a.a
        // console.log(a)
        // // delete this.refs.a.props.title
        //
        // console.log(this.refs.a.props)
    }


    render() {
        return (
            <div className="home-container">
                <Bcrumb title={this.state.subtitle}/>
                {this.props.children}
            </div>
        );
    }
}

export default Main;