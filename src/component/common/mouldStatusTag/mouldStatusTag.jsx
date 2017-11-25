import React, {Component} from 'react';
import './mouldStatusTag.less';

class statusTag extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const status = {
            1: '已申请',
            2: '待做模',
            3: '已完成'
        };
        return (
            <span className="statusTags">
                <span className={`statusTag ${this.props.status == 1 ? 'applied' : (this.props.status == 2 ? 'waited' : 'done')}`}>{status[this.props.status]}</span>
            </span>
        )
    }
}

export default statusTag;