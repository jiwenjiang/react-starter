import React, { Component } from 'react'; // 引入了React和PropTypes
import './login.less';
import url from '_config/ip/about';
import xhr from '_services/xhr/index';
import { PureRender } from '_services/decorator';
import { Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import G2 from '@antv/g2';
import DataSet from '@antv/data-set';

const Option = Select.Option;
const { RangePicker } = DatePicker;

let chart = {};

/* 以类的方式创建一个组件 */
@PureRender()
class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            created_before: moment().day(6).format('YYYY-MM-DD'),
            created_after: moment().day(1).format('YYYY-MM-DD'),
            scope: 'all',
            per_page: 100
        };
        this.initArr = [46, 40, 36, 35, 45];
        this.dataArr = []
        this.id = 'mountNode'
    }

    componentDidMount() {
        // this.initChart();
        this.arrQueue();
    }

    arrQueue() {
        this.Arrlength = this.initArr.length;
        this.dataArr = [];
        this.initArr.forEach((v) => {
            this.getData({ ...this.state, assignee_id: v, data: '' })
        })
    }


    getData(param) {
        xhr.get(url.issues, param, (data) => {
            let ok = 0
            let doing = 0
            let strId = '';
            this.setState({ data });
            data && data.forEach(v => {
                v.labels.indexOf('Ok') > -1 ? ok++ : (doing++, strId += `${v.id},`);
            })
            if (data.length) {
                this.dataArr.push(
                    {
                        value: ok,
                        type: `${data[0] && data[0].assignee.name}(${ok + doing})`,
                        name: `${data[0].assignee.name}已完成(${ok})`,
                        strId
                    },
                    {
                        value: doing,
                        type: `${data[0] && data[0].assignee.name}(${ok + doing})`,
                        name: `${data[0].assignee.name}未完成(${doing})`,
                        strId
                    }
                )
            }
            this.Arrlength--;
            if (this.Arrlength === 0) {
                this.renderChart(this.dataArr)
            }
        })
    }

    changeType(e) {
        this.initArr = e.split(',')
        this.arrQueue();
    }


    selectDate(v) {
        if (v === 'week' || v === 'month') {
            this.setState({
                created_before: v === 'week' ? moment(moment().day(6).format('YYYY-MM-DD')) : moment().endOf('month').format('YYYY-MM-DD'),
                created_after: v === 'week' ? moment().day(1).format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD')
            }, () => {
                this.arrQueue()
            })
        } else {
            this.setState({
                created_before: moment(v[1]).format('YYYY-MM-DD'),
                created_after: moment(v[0]).format('YYYY-MM-DD')
            }, () => {
                this.arrQueue()
            })
        }
    }


    renderChart(v) {
        this.id += +'1';
        let newItem = document.createElement('div');
        newItem.setAttribute('id', this.id);
        let parentItem = document.getElementsByClassName('container')[0]
        let oldItem = parentItem.childNodes[1]
        parentItem.replaceChild(newItem, oldItem);

        const { DataView } = DataSet;
        const data = v;
        const dv = new DataView();
        dv.source(data).transform({
            type: 'percent',
            field: 'value',
            dimension: 'type',
            as: 'percent'
        });
        chart = new G2.Chart({
            container: this.id,
            forceFit: true,
            height: 600,
            padding: 0
        });
        chart.source(dv, {
            percent: {
                formatter: val => {
                    val = (val * 100).toFixed(2) + '%';
                    return val;
                }
            }
        });
        chart.coord('theta', {
            radius: 0.5
        });
        chart.tooltip({
            showTitle: false,
            itemTpl: '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
        });
        chart.legend(false);
        chart.intervalStack().position('percent').color('type').label('type', {
            offset: -10
        }).tooltip('name*percent', (item, percent) => {
            percent = (percent * 100).toFixed(2) + '%';
            return {
                name: item,
                value: percent
            };
        }).select(false).style({
            lineWidth: 1,
            stroke: '#fff'
        });

        const outterView = chart.view();
        const dv1 = new DataView();
        dv1.source(data).transform({
            type: 'percent',
            field: 'value',
            dimension: 'name',
            as: 'percent'
        });
        outterView.source(dv1, {
            percent: {
                formatter: val => {
                    val = (val * 100).toFixed(2) + '%';
                    return val;
                }
            }
        });
        outterView.coord('theta', {
            innerRadius: 0.5 / 0.75,
            radius: 0.75
        });
        outterView.intervalStack().position('percent').color('name', ['#BAE7FF', '#7FC9FE', '#71E3E3', '#ABF5F5',
            '#8EE0A1', '#BAF5C4', '#FFB6C1', '#DB7093', '#6495ED', '#4682B4']).label('name').tooltip('name*percent', (item, percent) => {
            percent = (percent * 100).toFixed(2) + '%';
            return {
                name: item,
                value: percent
            };
        }).select(false).style({
            lineWidth: 1,
            stroke: '#fff'
        });
        chart.on('interval:click', ev => {
            const data = ev.data;
            if (data) {
                this.setState({
                    strId: data._origin['strId']
                })
                // const name = data._origin['name'];
                // window.open('http://www.baidu.com/s?wd=' + name);
            }
        });
        chart.render();
    }


    render() {
        const { created_after, created_before, strId, data } = this.state;
        return (
            <div className="container">
                <div className="box">
                    <Select defaultValue="前端" style={{ width: 120, marginRight: 15 }}
                            onChange={(e) => this.changeType(e)}>
                        <Option value="46,40,36,35,45">前端</Option>
                        <Option value="35,37,41,42,47">后端</Option>
                    </Select>
                    <RangePicker
                        value={[moment(created_after, 'YYYY-MM-DD'), moment(created_before, 'YYYY-MM-DD')]}
                        onChange={(e) => this.selectDate(e)}
                        defaultValue={[moment(created_after, 'YYYY-MM-DD'), moment(created_before, 'YYYY-MM-DD')]}
                        format={'YYYY-MM-DD'}
                    />
                    <Button type="primary" onClick={() => this.selectDate('week')}>本周</Button>
                    <Button type="primary" onClick={() => this.selectDate('month')}>本月</Button>
                </div>
                <div id="mountNode"></div>
                {data && data.length === 0 ? <p style={{ fontSize: 16, textAlign: 'center' }}>暂无数据</p> : ''}
                <div className='showId'>{strId}</div>
            </div>
        );
    }
}

export default Main;