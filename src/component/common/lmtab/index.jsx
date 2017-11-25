import React, {Component} from 'react';
import './index.less'


export class Lmtab extends Component {
    constructor(props) {
        super(props);
        let curTab = this.props.curTab;
        this.state = {
            curIndex: curTab || 0
        }
    }

    componentDidMount() {
    }

    changeTab(i) {
        this.props.changeTab(i)
        this.setState({
            curIndex: i
        });
    }

    render() {

        return (
            <div className="lm-tab-contain">
                {this.props.tabs.map((v, i) => {
                    return <div key={i} className={`lm-tab ${this.state.curIndex == i ? 'active' : ''}`}
                                onClick={() => this.changeTab(i)}>
                        {v}
                        <div className={`${this.state.curIndex == i ? 'border-line' : ''}`}>
                            <span></span>
                        </div>
                    </div>
                })}
            </div>
        )
    }
}