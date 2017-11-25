import React, {Component} from 'react';
import './errorStatusTag.less';

class statusTag extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const status = {
            1: '未处理',
            2: '已处理'
        };
        return (
            <span className="statusTags">
                <span className={`statusTag ${this.props.status == 1 ? 'wait' : 'done'}`}>{status[this.props.status]}</span>
            </span>
        )
    }
}

export default statusTag;