import React, {Component} from 'react'; // 引入了React和PropTypes
import {Modal, Table} from 'antd';


/* 以类的方式创建一个组件 */
class ModalTable extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    handleTableChange = (e) => {
        if (this.props.handleTableChange) {
            this.props.handleTableChange(e);
        }
    }


    render() {
        const height = {height: '20px'};
        const {visible, title, cancel, footer, columns, dataSource, rowKey, width, pagenation} = this.props;
        return (
            <div>
                <Modal
                    visible={visible}
                    title={title}
                    onCancel={cancel}
                    width={width || 800}
                    footer={footer}>
                    <Table className='sortTable' columns={columns} onChange={this.handleTableChange}
                           dataSource={dataSource} pagination={pagenation}
                           rowKey={record => record[rowKey] || record.id || record.prescriptionId}/>
                    {pagenation ? '' : <p style={height}></p>}
                </Modal>
            </div>
        );
    }
}


export default ModalTable;