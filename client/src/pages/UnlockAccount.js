// reset password
// ID, password, confirm. server to login
import {Button, Col, Form, Input, message, Row} from 'antd'
import React from 'react';
import {LockOutlined} from "@ant-design/icons"
import {useStore} from "../store";
import {useNavigate} from "react-router-dom";


export default function UnlockAccount() {
    const [form] = Form.useForm()
    const {updateStore} = useStore()
    const navigate = useNavigate()

    const onFinish = async (values) => {
        await updateStore.resetPassword(values)
            .then(result => {
                if (result.status === 0) {
                    navigate('/')
                    message.success(result.message)
                } else {
                    form.setFieldsValue({member_id: ''})
                    message.error(result.message)
                }
            })
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo)
    }

    return (
        <Form
            name="basic"
            labelCol={{span: 9}}
            wrapperCol={{span: 6}}
            form={form}
            initialValues={{}}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            style={{paddingTop: 200}}
            autoComplete="off"
        >
            <div className="register-heading">Reset Your Account</div>
            <Form.Item
                name="member_id"
                label="Member ID"
                tooltip="Your member ID"
                rules={[{required: true, message: 'Please enter your Member ID!'}]}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name="password"
                label="New password"
                rules={[
                    {min: 6, message: 'Your password should be at least 6 characters!'},
                    {required: true, message: 'Please enter your password!'}
                ]}
                hasFeedback
            >
                <Input.Password/>
            </Form.Item>
            <Form.Item
                name="confirm"
                label="Confirm password"
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
                <Input.Password type="password" maxLength={20}/>
            </Form.Item>

            <Form.Item label="Captcha">
                <Row gutter={8}>
                    <Col span={10}>
                        <Form.Item
                            name="get_captcha"
                            noStyle
                            rules={[{
                                required: true,
                                message: 'Please enter the captcha you got!',
                            }, {
                                type: "number",
                                message: 'Your captcha must be digits!'
                            }]}
                        >
                            <Input prefix={<LockOutlined className="prefixIcon"/>} placeholder="Enter captcha"/>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Button> <b><a>Get captcha</a></b></Button>
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                wrapperCol={{offset: 9, span: 6}}
            >
                <Button type="primary" htmlType="submit" size="large">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}
