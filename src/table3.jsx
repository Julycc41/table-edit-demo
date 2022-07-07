import { AutoComplete, Form, Input, Select, Table } from "antd";
import "antd/dist/antd.css";
import PropTypes from "prop-types";
import React from "react";

export class SetMapping extends React.Component {
 static propTypes = {
   form: PropTypes.shape({}).isRequired,
 };

 state = {
   mappingState: [],
   appnameList: [],
   tagList: []
 };

 componentDidMount() {}

 // 这里判断下 IP 是不是有效的，以及是否重复
 syslogIPValidator = () => ({
   validator: (rule, value, callback) => {
     if (value && value.trim() !== "") {
       const reg = /^(\d{1,3}|\*)\.(\d{1,3}|\*)\.(\d{1,3}|\*)\.(\d{1,3}|\*)$/i;
       if (!reg.test(value.trim())) {
         callback("IP地址格式错误");
       } else if (this.checkIfExistedIP(value)) {
         callback("IP地址重复");
       } else {
         callback();
       }
     }
   }
 });

 checkIfExistedIP = value => {
   const { form } = this.props;
   const { getFieldValue } = form;
   const mapping = getFieldValue("mapping") || [];

   const mappingArray = mapping ? mapping.filter(one => one.ip === value) : [];
   if (mappingArray.length > 1) {
     return true;
   }
   return false;
 };

 // 添加一行数据
 addOneMapping = () => {
   const { form } = this.props;
   const { getFieldsValue, validateFields } = form;
   const { mappingState } = this.state;
   const mapping = getFieldsValue().mapping || mappingState;
   // 如果表格中有数据-->检测下之前的有没有填写完整
   if (mapping && mapping.length !== 0) {
     validateFields(["mapping"], { force: true }, errors => {
       if (!errors) {
         mapping.push({
           ip: "",
           appname: "",
           tag: "",
           charset: ""
         });
         this.setState({ mappingState: mapping });
       }
     });
   } else {
     mapping.push({
       ip: "",
       appname: "",
       tag: "",
       charset: ""
     });
     this.setState({ mappingState: mapping });
   }
 };

 // 移除某一项
 // mapping 为 form 的属性名
 // mappingState 为用来渲染 table 的数据源
 // 所以删除时，需要两个一起修改
 removeOneMapping = index => {
   const { form } = this.props;
   const { getFieldValue } = form;

   const mapping = getFieldValue("mapping");
   mapping.splice(index, 1);

   this.setState({
     mappingState: mapping
   });
   form.setFieldsValue({
     mapping
   });
 };

 render() {
   const { mappingState } = this.state;
   const { form, appnameList, tagList } = this.props;
   const { getFieldDecorator } = form;

   const PLACEHOLDER = "请输入";

   const tableTitle = [
     {
       title: "ip",
       dataIndex: "ip",
       key: "ip",
       width: 205,
       render: (ip, one, index) => (
         <Form.Item>
           {getFieldDecorator(`mapping[${index}].ip`, {
             initialValue: ip || "",
             validateFirst: true,
             validateTrigger: ["onChange", "onFocus"],
             rules: [
               {
                 required: true,
                 message: "请输入IP地址"
               },
               this.syslogIPValidator()
             ]
           })(
             <Input
               size="small"
               style={{ width: "170px" }}
               autoComplete="off"
               placeholder={PLACEHOLDER}
             />
           )}
         </Form.Item>
       )
     },
     {
       title: "appname",
       dataIndex: "appname",
       key: "appname",
       width: 205,
       render: (appname, one, index) => (
         <Form.Item>
           {getFieldDecorator(`mapping[${index}].appname`, {
             initialValue: appname || "",
             validateFirst: true,
             validateTrigger: ["onChange", "onBlur"],
             rules: [
               {
                 required: true,
                 message: "请输入 appname"
               }
             ]
           })(
             <AutoComplete
               size="small"
               dataSource={appnameList}
               style={{ width: "170px" }}
               placeholder={PLACEHOLDER}
               filterOption={(inputValue, option) =>
                 option.props.children
                   .toUpperCase()
                   .indexOf(inputValue.toUpperCase()) !== -1
               }
             />
           )}
         </Form.Item>
       )
     },
     {
       title: "tag",
       dataIndex: "tag",
       key: "tag",
       width: 205,
       render: (tag, one, index) => (
         <Form.Item>
           {getFieldDecorator(`mapping[${index}].tag`, {
             initialValue: tag || "",
             validateFirst: true,
             validateTrigger: ["onChange", "onBlur"],
             rules: [
               {
                 required: true,
                 message: "请输入 tag"
               }
             ]
           })(
             <AutoComplete
               size="small"
               dataSource={tagList}
               style={{ width: "170px" }}
               placeholder={PLACEHOLDER}
               filterOption={(inputValue, option) =>
                 option.props.children
                   .toUpperCase()
                   .indexOf(inputValue.toUpperCase()) !== -1
               }
             />
           )}
         </Form.Item>
       )
     },
     {
       title: "charset",
       dataIndex: "charset",
       key: "charset",
       width: 110,
       render: (charset, one, index) => (
         <Form.Item>
           {getFieldDecorator(`mapping[${index}].charset`, {
             initialValue: charset || "utf-8"
           })(
             <Select size="small">
               <Select.Option value="utf-8" style={{ fontSize: 12 }}>
                 utf-8
               </Select.Option>
               <Select.Option value="gbk" style={{ fontSize: 12 }}>
                 gbk
               </Select.Option>
             </Select>
           )}
         </Form.Item>
       )
     }
   ];

   return (
     <div className="setMapping">
       <Table
         bordered
         size="small"
         className="tableBody"
         rowKey={(record, index) => index}
         columns={tableTitle}
         dataSource={mappingState}
         pagination={false}
       />
       <span className="addNew" onClick={this.addOneMapping}>
         添加新映射
       </span>
     </div>
   );
 }
}

