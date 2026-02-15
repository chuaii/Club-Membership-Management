import {Button, Card, Form, Input, message, Select} from "antd";
import {useNavigate} from "react-router-dom";
import {useStore} from "../../store";
import React from "react";

const {Option} = Select
const formItemLayout = {
    labelCol: {
        span: 9
    },
    wrapperCol: {
        span: 7
    },
}
const tailFormItemLayout = {
    wrapperCol: {
        span: 16,
        offset: 9
    }
}


export default function Signup() {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const {signupStore} = useStore()

    const onFinish = (values) => {
        signupStore.staffSignup(values)
            .then(result => {
                if (result.status === 0) {
                    navigate('/')
                    message.success(result.message)
                } else {
                    form.setFieldsValue({staff_id: ''})
                    message.error(result.message)
                }
            })
            .catch(err => {
                throw Error(err)
            })
    }

    const onFinishFailed = (err) => {
        console.log('Failed: ', err)
    }

    return (
        <div className="staff-register">
            <Card className="staff-register-container">
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{middle_name: ''}}
                    scrollToFirstError
                >
                    <div className="register-heading">Register a Staff</div>
                    <Form.Item
                        name="firstname"
                        label="First Name"
                        rules={[{required: true, message: 'Please enter your first name!'},
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
                    <Form.Item name="middle_name" label="Middle Name">
                        <Input maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name="lastname"
                        label="Last Name"
                        rules={[{required: true, message: 'Please enter your last name!'}]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="E-mail"
                        rules={[
                            {type: 'email', message: 'The input is not valid E-mail!'},
                            {required: true, message: 'Please enter your E-mail!'}
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{required: true, message: 'Please enter your phone number!'}]}
                    >
                        <Input maxLength={30} style={{width: '100%'}}/>
                    </Form.Item>
                    <Form.Item
                        name="staff_id"
                        label="Staff ID"
                        tooltip="Create your custom staff ID"
                        rules={[
                            {min: 3, message: 'Your Staff ID should be at least 3 characters!'},
                            {max: 20, message: 'Your Staff ID  should be at most 20 characters!'},
                            {required: true, message: 'Please enter your Staff ID!'}
                        ]}
                    >
                        <Input maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {min: 6, message: 'Your password should be at least 6 characters!'},
                            {max: 20, message: 'Your password should be at most 20 characters!'},
                            {required: true, message: 'Please enter your password!'}
                        ]}
                        hasFeedback
                    >
                        <Input.Password maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {required: true, message: 'Please confirm your password!'},
                            ({getFieldValue}) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                                }
                            })
                        ]}
                    >
                        <Input.Password type="password" maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        name="user_role"
                        label="Role"
                        rules={[{required: true, message: 'Please select role!'}]}
                    >
                        <Select placeholder="select role" style={{width: '180px'}}>
                            <Option value="Membership Admin">Membership Admin</Option>
                            <Option value="Club Management User">Club Management User</Option>
                            <Option value="System Admin">System Admin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large" shape="round">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}