import {Breadcrumb, Card, Form, Input, message, Modal, Select} from 'antd';
import React, {useEffect, useState} from 'react';
import './Profile.css'
import {useStore} from "../../store";
import {Link, useSearchParams} from "react-router-dom";

const {Option} = Select
const formItemLayout = {
    labelCol: {
        sm: {span: 7}
    },
    wrapperCol: {
        sm: {span: 12}
    }
}


// Show update each personal information dialog
const UpdateItem = (props) => {
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    const {updateStore, loginStore, userStore} = useStore()

    const showDialog = () => {
        setOpen(true)
    }

    const handleOk = async () => {
        await form.validateFields()
            .then(value => {
                const userInfo = {member_id: loginStore.member_id, ...value}

                updateStore.updateMemberInfo(userInfo)
                    .then(result => {
                        if (result.status === 0) {
                            message.success(result.message)
                        } else {
                            message.error(result.message)
                        }
                    })
                form.resetFields()
                setOpen(false)
            })
            .catch(reason => {
                console.log('Validate Failed:', reason)
            })
    }

    const handleCancel = () => {
        form.resetFields()
        setOpen(false)
    }

    // backfill the user information to the form
    useEffect(() => {
        const loadInfo = async () => {
            const profileData = await userStore.getMemberInfo(loginStore.member_id)
            const {birthday, ...userInfo} = profileData
            form.setFieldsValue({...userInfo})
        }
        if (open) {
            loadInfo()
        }
    }, [open, form, userStore, loginStore.member_id])

    return (
        <>
            <a type="primary" onClick={showDialog} style={{fontWeight: 'bold'}}>Update</a>
            <Modal
                title={`Update your ${props.attribute}`}
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
            >
                <Form form={form} name="form_in_modal" {...formItemLayout}>
                    {props.attribute === 'name' && (<>
                        <Form.Item
                            name="firstname"
                            label="First Name"
                            rules={[{required: true, message: 'Please enter your first name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item name="middle_name" label="Middle Name" initialValue="">
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="lastname"
                            label="Last Name"
                            rules={[{required: true, message: 'Please enter your last name!'}]}
                        >
                            <Input/>
                        </Form.Item>
                    </>)}
                    {props.attribute === 'gender' && (
                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{required: true, message: 'Please select gender!'}]}
                        >
                            <Select placeholder="select gender" style={{width: '150px'}}>
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                    )}
                    {props.attribute === 'birthday' && (
                        <Form.Item label="Birthday">
                            <Form.Item
                                name="birthday_year"
                                style={{display: 'inline-block', marginRight: 10}}
                                rules={[{required: true, message: 'Enter year!'}]}
                            >
                                <Input placeholder="YYYY" style={{width: '70px'}}/>
                            </Form.Item>
                            <Form.Item
                                name="birthday_month"
                                style={{display: 'inline-block', marginRight: 10}}
                                rules={[{required: true, message: 'Select month!'}]}
                            >
                                <Select placeholder="MM" style={{width: '70px'}}>
                                    <Option value="1">Jan</Option>
                                    <Option value="2">Feb</Option>
                                    <Option value="3">Mar</Option>
                                    <Option value="4">Apr</Option>
                                    <Option value="5">May</Option>
                                    <Option value="6">Jun</Option>
                                    <Option value="7">Jul</Option>
                                    <Option value="8">Aug</Option>
                                    <Option value="9">Sept</Option>
                                    <Option value="10">Oct</Option>
                                    <Option value="11">Nov</Option>
                                    <Option value="12">Dec</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="birthday_date"
                                style={{display: 'inline-block', marginRight: 10}}
                                rules={[{required: true, message: 'Enter date!'}]}
                            >
                                <Input placeholder="DD" style={{width: '60px'}}/>
                            </Form.Item>
                        </Form.Item>
                    )}
                    {props.attribute === 'address' && (<>
                        <Form.Item
                            name="address_line1"
                            label="Address line 1"
                            rules={[{required: true, message: 'Please enter your address!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item name="address_line2" label="Address line 2" initialValue="">
                            <Input/>
                        </Form.Item>
                        <Form.Item name="address_line3" label="Address line 3" initialValue="">
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="address_city"
                            label="City"
                            rules={[{required: true, message: 'Please enter your city!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="address_country"
                            label="Country"
                            rules={[{required: true, message: 'Please enter your country!'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            name="address_postalcode"
                            label="Postal Code"
                            rules={[{required: true, message: 'Please enter your postal code!'}]}
                        >
                            <Input/>
                        </Form.Item>
                    </>)}
                    {props.attribute === 'email' && (
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {type: 'email', message: 'The input is not valid E-mail!'},
                                {required: true, message: 'Please enter your E-mail!'}
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    )}
                    {props.attribute === 'phone' && (
                        <Form.Item
                            name="phone"
                            label="Phone Number"
                            rules={[{required: true, message: 'Please enter your phone number!'}]}
                        >
                            <Input style={{width: '100%'}}/>
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </>
    )
}


export default function Profile() {
    const [profile, setProfile] = useState({})
    const {loginStore, userStore} = useStore()
    const [params] = useSearchParams()
    const member_id = params.get('id')

    useEffect(() => {
        const loadInfo = async () => {
            let profileData
            if (!loginStore.member_id) {
                profileData = await userStore.getMemberInfo(member_id)
            } else {
                profileData = await userStore.getMemberInfo(loginStore.member_id)
            }
            if (profileData) {
                setProfile({...profileData})
            }
        }
        loadInfo()
    }, [loginStore.member_id, member_id, userStore])

    return (
        <div className="profile-content">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/">Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Profile</Breadcrumb.Item>
                    </Breadcrumb>
                }
                bodyStyle={{width: '400px'}}
            >
                <Card type="inner" title="MEMBER ID" hoverable>
                    {profile.member_id}
                </Card>
                <Card type="inner" title="NAME" extra={<UpdateItem attribute={'name'}/>} hoverable>
                    {profile.firstname} {profile.middle_name} {profile.lastname}
                </Card>
                <Card type="inner" title="GENDER" extra={<UpdateItem attribute={'gender'}/>} hoverable>
                    {(profile.gender === 'male') ? 'Male' : (profile.gender === 'female') ? 'Female' : 'Other'}
                </Card>
                <Card type="inner" title="BIRTHDAY" extra={<UpdateItem attribute={'birthday'}/>} hoverable>
                    {profile.birthday_year}/{profile.birthday_month}/{profile.birthday_date}
                </Card>
                <Card type="inner" title="ADDRESS" extra={<UpdateItem attribute={'address'}/>} hoverable>
                    {profile.address_line1}{profile.address_line2 ? `, ${profile.address_line2}` : ''}{profile.address_line3 ? `, ${profile.address_line3}` : ''}<br/>
                    {profile.address_city}, {profile.address_country}<br/>
                    {profile.address_postalcode}
                </Card>
                <Card type="inner" title="EMAIL" extra={<UpdateItem attribute={'email'}/>} hoverable>
                    {profile.email}
                </Card>
                <Card type="inner" title="PHONE NUMBER" extra={<UpdateItem attribute={'phone'}/>} hoverable>
                    {profile.phone}
                </Card>
                <Card type="inner" title="REGISTERED DATE" hoverable>
                    {profile.registered_date}
                </Card>
                <Card type="inner" title="MEMBERSHIP EFFECTIVE DATE" hoverable>
                    {profile.effective_date}
                </Card>
                <Card type="inner" title="MEMBERSHIP EXPIRE DATE" hoverable>
                    {profile.expire_date}
                </Card>
                <Card type="inner" title="MEMBERSHIP STATUS" hoverable>
                    {(profile.membership_status ? 'Yes' : 'No')}
                </Card>

            </Card>
        </div>
    )
}
