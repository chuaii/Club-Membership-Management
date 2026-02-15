import {Breadcrumb, Button, Card, Form, Input, message, Select} from 'antd';
import React, {useEffect} from 'react';
import {useStore} from "../../store";
import {Link, useNavigate, useSearchParams} from "react-router-dom";

const {Option} = Select
const formItemLayout = {
    labelCol: {
        sm: {span: 7}
    },
    wrapperCol: {
        sm: {span: 12}
    }
}
const tailFormItemLayout = {
    wrapperCol: {
        span: 16,
        offset: 9
    }
}


export default function UpdateStaffProfile() {
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const {updateStore, userStore} = useStore()
    const [params] = useSearchParams()
    const staff_id = params.get('id')

    const onFinish = async () => {
        await form.validateFields()
            .then(value => {
                const userInfo = {staff_id, ...value}

                updateStore.updateStaffInfo(userInfo)
                    .then(result => {
                        if (result.status === 0) {
                            navigate('/staff-list')
                            message.success(result.message)
                        } else {
                            message.error(result.message)
                        }
                    })
            })
            .catch(reason => {
                console.log('Validate Failed:', reason)
            })
    }

    const onFinishFailed = async (err) => {
        console.log('Failed:', err)
    }

    // backfill the user information to the form
    useEffect(() => {
        const loadDetail = () => {
            userStore.getStaffInfo(staff_id)
                .then(currProfile => {
                    form.setFieldsValue(currProfile)
                })
                .catch(err => {
                    throw Error(err)
                })
        }
        loadDetail()
    }, [form, userStore, staff_id])

    return (
        <div className="profile-content">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/">Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to="/staff-list">Staff List</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Update</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    {...formItemLayout}
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{middle_name: ''}}
                    scrollToFirstError
                >
                    <div className="register-heading">Update Staff Profile</div>
                    <Form.Item
                        name="firstname"
                        label="First Name"
                        rules={[{required: true, message: 'Please enter your first name!'},
                        ]}
                    >
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
                        name="user_role"
                        label="Role"
                        rules={[{required: true, message: 'Please select role!'}]}
                    >
                        <Select placeholder="select role" style={{width: '200px'}}>
                            <Option value="Membership Admin">Membership Admin</Option>
                            <Option value="Club Management User">Club Management User</Option>
                            <Option value="System Admin">System Admin</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout} className="resubmit-button">
                        <Button type="primary" htmlType="submit" size="large" shape="round">
                            Resubmit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}
