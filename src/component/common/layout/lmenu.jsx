import React, {Component} from 'react';

import Config from '../../../config/index';
import {Link} from 'react-router';
import {Menu, Icon} from 'antd';


/**
 * 公共菜单
 *
 * @export
 * @class Lmenu
 * @extends {Component}
 */

const SubMenu = Menu.SubMenu;
export class Lmenu extends Component {
    constructor(props, context) {
        super(props, context); //后才能用this获取实例化对象
        const openKeys = Config.localItem('OPENKEY') ? [Config.localItem('OPENKEY')] : [];
        this.state = {
            openKeys: openKeys
        };
    }

    onOpenChange = (openKeys) => {
        const state = this.state;
        const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
        const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
        }
        if (latestCloseKey) {
            nextOpenKeys = this.getAncestorKeys(latestCloseKey);
        }
        Config.localItem('OPENKEY', nextOpenKeys);
        this.setState({openKeys: nextOpenKeys});
    }
    getAncestorKeys = (key) => {
        const map = {
            sub3: ['sub2'],
        };
        return map[key] || [];
    }


    render() {
        return (

            <Menu openKeys={this.state.openKeys} onOpenChange={this.onOpenChange} theme="dark" mode={this.props.mode} defaultSelectedKeys={['/home/nurseStation/curPatient']}>

                <Menu.Item key="/home/image">
                    <Link to="/home/image">
                        <Icon type="laptop"/>
                        {!this.props.collapsed && <span className="nav-text">影像中心</span>}
                    </Link>
                </Menu.Item>
                <Menu.Item key="/home/nurseStation/curPatient">
                    <Link to="/home/nurseStation/curPatient">
                        <Icon type="medicine-box"/>
                        {!this.props.collapsed && <span className="nav-text">护士工作站</span>}
                    </Link>
                </Menu.Item>
                <SubMenu key="/home/mouldStation" title={<span><Icon type="scan"/><span className="nav-text">模具工作站</span></span>}>
                    <Menu.Item key="/home/mouldStation/mouldStation"><Link to="/home/mouldStation/mouldList"/>做模列表</Menu.Item>
                    <Menu.Item key="/home/mouldStation/queuing"><Link to="/home/mouldStation/queue"/>排队叫号</Menu.Item>
                </SubMenu>
                {/*<SubMenu key="/home/nurseStation" title={<span><Icon type="medicine-box" /><span className="nav-text">护士工作站</span></span>}>*/}
                    {/*<Menu.Item key="/home/nurseStation/curPatient"><Link to="/home/nurseStation/curPatient"/> 当前患者</Menu.Item>*/}
                    {/*<Menu.Item key="/home/nurseStation/prePatient">历史患者</Menu.Item>*/}
                {/*</SubMenu>*/}
            </Menu>

        )
    }
}