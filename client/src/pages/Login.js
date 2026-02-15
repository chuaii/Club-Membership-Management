import {FacebookOutlined, GoogleOutlined, LockOutlined, TwitterOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Input, message, Space, Tabs} from 'antd';
import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import './Login.css'
import {useStore} from '../store';

const iconStyles = {
    marginInlineStart: '16px',
    color: 'rgba(0, 0, 0, 0.2)',
    fontSize: '24px',
    verticalAlign: 'middle',
    cursor: 'pointer',
}
const types = [
    {
        key: 'member',
        label: 'Member',
    },
    {
        key: 'staff',
        label: 'Staff',
    }
]


export default function Login() {
    const [loginType, setLoginType] = useState('member')
    const navigate = useNavigate()
    const {loginStore} = useStore()
    const [form] = Form.useForm()

    const onFinish = async (values) => {
        const {member_id, staff_id} = values

        if (member_id) {  // If this user is a member
            const result = await loginStore.checkAccountLocked({member_id})

            // Check account status
            if (!result.account_locked) {
                await loginStore.memberLogin(values)

                if (loginStore.token !== '') {
                    navigate('/')
                    message.success('Successfully login!')
                    window.location.reload()
                } else {
                    form.setFieldsValue({password: ''})
                    message.error('Invalid Member ID or Password!')
                }
            } else {
                form.setFieldsValue({member_id: '', password: ''})
                message.error('Your account is locked, please contact us to unlock!')
            }

        } else if (staff_id) {  // If this user is a club staff
            await loginStore.staffLogin(values)

            if (loginStore.token !== '') {
                navigate('/')
                message.success('Successfully login!')
                window.location.reload()
            } else {
                form.setFieldsValue({password: ''})
                message.error('Invalid Staff ID or Password!')
            }
        }

    }

    const onFinishFailed = (err) => {
        console.log('Failed: ', err)
    }

    const redirectToSignup = () => {
        navigate('/signup')
    }

    const redirectToReset = () => {
        navigate('/unlock-account')
    }

    return (
        <div className="login-page" style={{backgroundColor: 'white'}}>
            <div className="login-heading">LOGIN TO ACCOUNT</div>
            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
                initialValues={{
                    remember: true
                }}
            >
                <Tabs centered activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)} items={types}/>

                {loginType === 'member' && (<>
                    <Form.Item
                        className="input-form"
                        name="member_id"
                        rules={[{
                            required: true,
                            message: 'Please enter your id!'
                        }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon"/>}
                            placeholder="member id"
                            maxLength={30}
                        />
                    </Form.Item>

                    <Form.Item
                        className="input-form"
                        name="password"
                        rules={[{
                            required: true,
                            message: 'Please enter your Password!'
                        }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon"/>}
                            type="password"
                            placeholder="password"
                            maxLength={30}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox><b>Remember me</b></Checkbox>
                        </Form.Item>
                        <a className="login-form-forgot" href="#reset" style={{float: 'right'}} onClick={(e) => { e.preventDefault(); redirectToReset(); }}>
                            <b>Forgot password?</b>
                        </a>
                    </Form.Item>

                </>)}

                {loginType === 'staff' && (<>
                    <Form.Item
                        className="input-form"
                        name="staff_id"
                        rules={[{
                            required: true,
                            message: 'Please enter your id!'
                        }]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="staff id"
                               maxLength={30}/>
                    </Form.Item>
                    <Form.Item
                        className="input-form"
                        name="password"
                        rules={[{
                            required: true,
                            message: 'Please enter your Password!'
                        }]}
                    >
                        <Input.Password prefix={<LockOutlined className="site-form-item-icon"/>} type="password"
                                        placeholder="password" maxLength={30}/>
                    </Form.Item>
                </>)}

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" shape="round"
                            size="large"><b>Log in</b></Button>
                </Form.Item>

            </Form>
            <div style={{marginBottom: 20, fontSize: 'large'}}>
                Don't have an account? <a href="#signup" onClick={(e) => { e.preventDefault(); redirectToSignup(); }}><b>Register Now!</b></a>
            </div>

            <Space style={{fontSize: 'large'}}>
                Other Login Methods
                <GoogleOutlined style={iconStyles}/>
                <FacebookOutlined style={iconStyles}/>
                <TwitterOutlined style={iconStyles}/>
            </Space>
        </div>
    )
}
