import { Button, Form, Input, Select, Switch, Table } from 'antd'
import 'antd/dist/antd.css'
import { useRef } from 'react'
import './index.css'

const TableEditForm = () => {
  const [form] = Form.useForm()
  const form2 = useRef()
  const onFinish = values => {
    console.log(values)
    console.log(form.validateFields())
    console.log(form2)
  }

  const getColumns = (add, remove) => {
    return [
      {
        title: '姓名',
        dataIndex: 'name',
        width: 400,
        render(text, field) {
          // 这里的写法是 Form.List 的方法 https://ant.design/components/form-cn/#components-form-demo-dynamic-form-items
          return (
            <Form.Item rules={[{ required: true, message: '请输入姓名' }]} name={[field.name, 'name']} fieldKey={[field.fieldKey, 'name']}>
              <Input placeholder="请输入姓名" allowClear />
            </Form.Item>
          )
        }
      },

      {
        title: '启用',
        dataIndex: 'bEnable',
        render: (text, field) => {
          return (
            <Form.Item  name={[field.name, 'bEnable']} fieldKey={[field.fieldKey, 'bEnable']}>
              <Switch defaultChecked={true} value={text} />
            </Form.Item>
          )
        }
      },
      {
        title: '学历',
        dataIndex: 'education',
        render(text, field) {
          return (
            <Form.Item rules={[{ required: true, message: '请选择学历' }]} name={[field.name, 'education']} fieldKey={[field.fieldKey, 'education']}>
              <Select placeholder="请输入姓名" allowClear>
                <Select.Option value="1">专科</Select.Option>
                <Select.Option value="2">本科</Select.Option>
                <Select.Option value="3">研究生</Select.Option>
              </Select>
            </Form.Item>
          )
        }
      }
    ]
  }
  const addItem = () => {
    form2.current({ bEnable: true })
    // // eslint-disable-next-line no-restricted-globals, no-restricted-globals
    //  addEventListener(form2.current, 'click', clickDOMButton, false)
  }

  return (
    <>
      <Button onClick={addItem}>新增</Button>
      <Form
        className="table-edit-form"
        form={form}
        onFinish={onFinish}
        initialValues={{
          tableForm: []
        }}
      >
        <Form.List name="tableForm">
          {(fields, { add, remove }) => {
            form2.current = add
            // 将Table视为 Form.List 中循环的 Form.Item
            return <Table dataSource={fields} columns={getColumns(add, remove)} rowKey="key" pagination={false} />
          }}
        </Form.List>
        <Form.Item>
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default TableEditForm
