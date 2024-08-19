import { Divider, Table } from 'antd';
import React, { useState, useRef, useMemo } from 'react'
import { Excel } from "antd-table-saveas-excel";


const TableComponent = (props) => {
    const { selectionType = 'checkbox', data: dataSource = [], columns = [], handleDeleteMany } = props
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const newColumnExport = useMemo(() => {
        const arr = columns?.filter((col) => col.dataIndex !== 'action')
        return arr
    }, [columns])


    const handleDeleteAll = () => {
        handleDeleteMany(rowSelectedKeys)
    }

    const exportExcel = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newColumnExport)
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setRowSelectedKeys(selectedRowKeys)
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };
    return (
        <div>
            <Divider />
            {rowSelectedKeys.length > 0 && (
                <div style={{
                    background: '#1d1ddd',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '10px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }}
                    onClick={handleDeleteAll}>
                    Xóa tất cả
                </div>
            )}
            <button onClick={exportExcel}>Export Excel</button>
            <Table
                rowKey={record => record.name}
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={dataSource}
                {...props}
            />
        </div>
    )
}

export default TableComponent
