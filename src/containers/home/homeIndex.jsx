import React, {Component} from 'react'; // 引入了React和PropTypes
import {connect} from 'react-redux';
// 公共面包屑
import {Bcrumb} from '../../component/common/bcrumb/bcrumb';
import './style/home.less'
// import {Row,Col} from 'antd';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 0
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="home-container">
                <Bcrumb titles={this.props.SubTitle}/>
                {this.props.children}
            </div>
        );
    }
}

let mapStateToProps = state => {
    return {
        SubTitle: state.subTitle
    }
};


export default connect(mapStateToProps)(Main);