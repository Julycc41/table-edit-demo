import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input, Popconfirm, Row, Switch, Table } from 'antd'
import { default as React, useRef, useState } from 'react'
import './tableEdit.css'
const { TextArea } = Input
function TableEdit() {
  const createRef = useRef()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false) //loading
  const [dataSource, setDataSource] = useState([
    {
      cTitle: '佩奇',
      cUrl: 'https://ant.design/components/form-cn/',
      bEnable: false
    },
    {
      cTitle: '乔治',
      cUrl: 'https://ant.design/components/form-cn/',
      bEnable: false
    }
  ]) //默认渲染的plan-banner数据

  //获取当前table-Columns
  const columns = [
    {
      title: '标题',
      width: 200,
      dataIndex: 'cTitle',
      align: 'center',
      render(text, field) {
        return (
          <Form.Item rules={[{ required: true, message: '请输入标题' }]} name={[field.name, 'cTitle']} fieldKey={[field.fieldKey, 'cTitle']}>
            <TextArea maxLength={30} placeholder="不超过30字" />
          </Form.Item>
        )
      }
    },
    {
      title: '链接',
      dataIndex: 'cUrl',
      align: 'center',
      render(text, field) {
        return (
          <Form.Item name={[field.name, 'cUrl']} fieldKey={[field.fieldKey, 'cUrl']} rules={[{ required: true, message: '请输入链接' }]}>
            <Input placeholder="请输入当前链接" />
          </Form.Item>
        )
      }
    },
    {
      title: '启用/禁用',
      dataIndex: 'bEnable',
      key: 'bEnable',
      width: 150,
      align: 'center',
      render: (text, field, index) => {
        const record = (form.getFieldsValue().tableForm || [])?.[index] || {}
        field.bEnable = record.bEnable
        field.nID = record.nID
        return (
          <Form.Item name={[field.name, 'bEnable']} fieldKey={[field.fieldKey, 'bEnable']}>
            <Switch defaultChecked={field.bEnable} checked={field.bEnable} onChange={value => onSetEnable(value, field.nID, index)} />
          </Form.Item>
        )
      }
    },
    {
      title: '操作',
      ataIndex: 'action',
      key: 'action',
      align: 'center',
      width: 150,
      render: (text, field, index) => {
        // 获取当前行数据，然后渲染你要的数据
        const record = (form.getFieldsValue().tableForm || [])?.[index] || {}
        field.nID = record.nID
        if (record.nID) {
          return (
            <Row>
              <Popconfirm title="确定是否删除?" onConfirm={() => deleteItem(record.nID, true)}>
                <Button icon={<DeleteOutlined />} danger>
                  删除
                </Button>
              </Popconfirm>
            </Row>
          )
        } else {
          return (
            <Row>
              <Button onClick={() => deleteItem(index, false)}>删除</Button>
            </Row>
          )
        }
      }
    }
  ]

  //启用 or 关闭
  const onSetEnable = (flag, id, index) => {
    if (!id) {
      const dataSource = form.getFieldsValue().tableForm //获取当前form dataSource
      dataSource[index].bEnable = flag
      form.setFieldsValue({
        tableForm: [...dataSource]
      })
    } else {
      //调用接口启用关闭
    }
  }

  // 删除当前元素
  const deleteItem = (id, flag) => {
    if (!flag) {
      //直接删除
      const dataSource = form.getFieldsValue().tableForm
      dataSource.splice(id, 1)
      form.setFieldsValue({
        tableForm: [...dataSource]
      })
    } else {
      //接口调用删除
    }
  }

  //添加一行
  const createNews = () => {
    const dataSource = form.getFieldsValue().tableForm
    const dataNew = [
      ...dataSource,
      {
        cpicUrl: '',
        cSubTitle: '',
        cTitle: '',
        bEnable: true
      }
    ]
    form.setFieldsValue({
      tableForm: [...dataNew]
    })
  }

  //保存
  const onFinish = () => {
    form.validateFields().then(res => {
      console.log(res, '新增数量')
      //!调用接口
    })
  }

  return (
    <div className="table-edit-wrapper">
      <div className="table-edit-header">
        <Button type="primary" onClick={onFinish}>
          保存
        </Button>
        <Button onClick={createNews}>添加行</Button>
      </div>
      <Form
        className="table-edit-table-form"
        form={form}
        onFinish={onFinish}
        initialValues={{
          tableForm: dataSource
        }}
      >
        <Form.List name="tableForm">
          {(fields, { add, remove }) => {
            createRef.current = add //绑定到ref上,外部进行调用add()
            return (
              <Table
                pagination={false}
                expandable={{ defaultExpandAllRows: true, indentSize: 50 }}
                className="table-edit-table"
                dataSource={fields}
                scroll={{ y: 'calc(100vh - 200px)' }}
                columns={columns}
                loading={loading}
                rowKey={(record, index) => {
                  return record.key
                }}
              />
            )
          }}
        </Form.List>
      </Form>
    </div>
  )
}

export default TableEdit
