import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import { TableListItem } from './data';
import { queryRoles } from './service';
import { queryRights } from '../RightTableList/service';
import UpdateForm from './components/UpdateForm';

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [current, setCurrent] = useState<TableListItem>();
  const [rights, setRights] = useState<Array<any>>([]);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '角色名称',
      dataIndex: 'name',
      rules: [
        {
          required: true,
          message: '规则名称为必填项',
        },
      ],
    },
    {
      title: '描述',
      dataIndex: 'desc',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '关键字',
      dataIndex: 'keyName',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '权限',
      render(_, record) {
        const roles = record.rights.map((right: { name: string; id: string }) => (
          <div key={right.id}>{right.name}</div>
        ));
        return roles;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div>
          <Button
            type="link"
            onClick={async () => {
              const result: {
                data: Array<any>;
              } = await queryRights({
                current: 1,
                pageSize: 99,
              });
              setRights(result.data);
              setCurrent(record);
              handleUpdateModalVisible(true);
            }}
          >
            编辑
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<TableListItem>
        headerTitle="角色表格"
        actionRef={actionRef}
        search={false}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
          </div>
        )}
        request={(params) => queryRoles(params)}
        columns={columns}
        rowSelection={false}
      />
      <UpdateForm
        onSubmit={() => {
          handleUpdateModalVisible(false);
          if (actionRef.current) {
            actionRef.current.reloadAndRest();
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
        }}
        visible={updateModalVisible}
        current={current}
        rights={rights}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
