import React, {Component} from 'react';
import './statusTag.less';

class statusTag extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const status = {
            '进行中': 'process',
            '异常': 'abnormal',
            '结束': 'end'
        };
        return (
            <span className="statusTags">
                <span className={`statusTag ${status[this.props.status]}`}>{this.props.taskName}</span>
            </span>
        )
    }
}

export default statusTag;