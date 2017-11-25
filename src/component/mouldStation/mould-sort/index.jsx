import React, {Component} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import './index.less';


class SortTable extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    componentDidMount() {
    }

    render() {
        const {head, datas} = this.props;
        return (
            <div className="table">
                <div className="head">
                    <div>&nbsp;</div>
                    {head}
                </div>
                <div className="body">
                    <div className="firstTr">
                        <div>&nbsp;</div>
                        {datas && datas.firstTr}
                    </div>
                    {datas && datas.listTr}
                </div>
            </div>
        )
    }
}

export default SortTable;