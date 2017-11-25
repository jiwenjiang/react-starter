import React, {Component} from 'react'; // 引入了React和PropTypes
import url from '../../../config/ip/imageCenter/detail';
import xhr from '../../../services/xhr/index';
import noty from '../../../component/common/noty';
import './index.less';
import load from '../../../assets/img/loading.gif';


// import url from '../../../config/ip/detail';


/* 以类的方式创建一个组件 */
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        this.download();
    }

    download() {
        xhr.get(url.download, {id: this.props.params.id}, (data) => {
            switch (data.status) {
                case 0:
                    noty('success', '影像下载成功');
                    this.setState({
                        loading: false
                    });
                    window.location.href = data.url;
                    break;
                case 1:
                    setTimeout(() => {
                        this.download();
                    }, 1000)
                    break;
                default:
                    noty('error', '影像下载失败');
            }
        })
    }

    render() {
        const loadmsg = this.state.loading ? '正在打包，请耐心等候...' : '导出成功';
        return (
            <div className="bgcolor">
                <div className="imgbox">
                    <img src={load} alt=""/>
                    <p>{loadmsg}</p>
                </div>
            </div>
        );
    }
}

export default Main;