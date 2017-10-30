import React, {Component} from 'react';
import './index.less'


export class Lmtab extends Component {
    static propTypes = {
        curTab: React.PropTypes.number,
        tabs: React.PropTypes.array.isRequired
    }
    static defaultProps = {
        curTab: 1
    }

    constructor(props) {
        super(props);
        this.state = {
            curIndex: this.props.curTab || 0
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

