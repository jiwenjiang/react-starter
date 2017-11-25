import React, {Component} from 'react';
// import Moment from 'moment';
// import {sex} from '../../../services/filter/index'
// import '../../../assets/fonts/iconfont.css';
import MouldList from '../../../component/mouldStation/mould-list/mould-list';
import Mouldsort from '_containers/mouldStation/mouldSort/';
import ErrorList from '../mouldErrorList/index';
import {Lmtab} from '../../../component/common/lmtab';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {subTitle} from '../../../redux/action';
// import url from '../../../config/ip/nurseStation/nurseStation';
// import xhr from '../../../services/xhr/index';
import './mouldStation.less';


class mouldStation extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state = {
            curTab: 0
        };
    }

    componentDidMount() {
        const titles = [
            {link: '/home/mouldStation', text: '做模列表'},
        ];
        this.props.setTitle(titles);
    }

    onTabChange = (i) => {
        this.setState({
            curTab: i
        });
    };


    render = () => {
        const tabone = <div className="panel-content">
            <MouldList></MouldList>
        </div>
        const tabtwo = <div className="panel-content">
            <Mouldsort></Mouldsort>
        </div>
        const tabthree = <div className="panel-content">
            <ErrorList></ErrorList>
        </div>
        // const { getFieldDecorator } = this.props.form;
        return (
            <div className="mouldStation">
                <div className="tab">
                    <Lmtab tabs={['数据列表', '预约日历', '异常列表']} changeTab={(i) => this.onTabChange(i)}
                           curTab={this.state.curTab}/>
                </div>
                {this.state.curTab == 0 ? tabone : (this.state.curTab == 1 ? tabtwo : tabthree)}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return state
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        setTitle: subTitle
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(mouldStation);