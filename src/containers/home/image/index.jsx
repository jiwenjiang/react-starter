import React, {Component} from 'react'; // 引入了React和PropTypes
import './image.less';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Lmtab} from '_component/lmTab'

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 'large',
            data: [],
            loading: true,
            curTab: 0
        };
        this.node = null;
    }

    componentDidMount() {
        console.log('did')
    }

    onTabChange(i) {
        this.setState({
            curTab: i
        });
    }

    refInput = (node) => {
        console.log(node)
        console.log(this.refs.a)
        this.node = node;
    }

    virtual(e) {
        console.log(e)
        console.log(this.node)
        console.log(this.refs.a)
        console.log(document.getElementById('aa'))
    }

    onMouseEnterHandler(i) {
        // console.log(document.getElementById('yy'))
        // let yy=document.getElementById('yy');
        // yy.style.backgroundColor='red'
        console.log(i.target)
        i.target.style.backgroundColor = 'red';
    }

    onMouseLeaveHandler() {
        // console.log(i)
    }


    render() {

        const tabone = <div className="panel-content">
            <ul id="yy">
                {[1, 2, 3, 4].map((v, i) => {
                    return <li key={i} onMouseLeave={this.onMouseLeaveHandler.bind(this)}
                               onMouseEnter={this.onMouseEnterHandler.bind(this)}>{v}</li>
                })}
            </ul>
        </div>
        const tabtwo = <div className="panel-content">
            <table>
                <thead>
                <tr>
                    <th>1</th>
                    <th>2</th>
                    <th>3</th>
                    <th>4</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>4</td>
                </tr>
                </tbody>
            </table>
            <p>
                ref测试virtual<input type="text" ref='a' id="aa" onBlur={(e) => this.virtual(e)}/>
                ref测试dom<input type="text" ref={this.refInput}/>
            </p>
        </div>
        return (
            <div className="imageCenter" style={{'marginTop': 15}}>
                <div className="tab">
                    <Lmtab tabs={['TAB_ONE', 'TAB_TWO']} curTab={0} changeTab={(i) => this.onTabChange(i)}/>
                </div>
                {this.state.curTab == 0 ? tabone : tabtwo}

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return state
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Main);