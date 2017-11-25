import React, {Component} from 'react';
import '../../../assets/fonts/iconfont.css';
import './noData.less';

class NoData extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="no-data">
                <div className="noData">
                    <i className="iconfont icon-wushuju"></i>
                    暂无数据
                </div>
            </div>
        )
    }
}

export default NoData;