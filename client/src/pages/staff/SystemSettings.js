import {Breadcrumb, Card, Form, InputNumber, message, Modal} from "antd";
import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useStore} from "../../store";

const formItemLayout = {
    labelCol: {
        sm: {span: 7}
    },
    wrapperCol: {
        sm: {span: 12}
    }
}


const SetMembershipFee = () => {
    const [form] = Form.useForm()
    const {settingStore} = useStore()
    const [open, setOpen] = useState(false)
    const [fee, setFee] = useState(1)

    const showDialog = () => {
        setOpen(true)
    }

    const handleOk = async () => {
        const value = await form.validateFields()
        const result = await settingStore.updateMembershipFee(value)

        if (result.status === 0) {
            message.success(result.message)
            window.location.reload()
        } else {
            message.error(result.message)
        }
        form.resetFields()
        setOpen(false)
    }

    const handleCancel = () => {
        form.resetFields()
        setOpen(false)
    }

    useEffect(() => {
        const loadFee = async () => {
            const result = await settingStore.getMembershipFee()
            setFee(result.membership_fee)
        }
        loadFee()
    }, [])

    return (
        <>
            <a type="primary" onClick={showDialog}>Update fee</a>
            <Modal
                title="Update Membership Fee"
                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    {...formItemLayout}
                    name="form_in_modal"
                    initialValues={{membership_fee: fee}}
                >
                    <Form.Item
                        label="Membership Fee"
                        name="membership_fee"
                        rules={[{required: true, message: 'Please enter membership fee!'}]}
                    >
                        <InputNumber
                            placeholder="Enter fee amount"
                            min={1}
                            max={9999}
                            formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            style={{width: '120px'}}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}


export default function SystemSettings() {
    return (
        <div className="settings-content">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/">Home</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Settings</Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <div className="password-link" style={{fontWeight: "bold", marginBottom: 20}}>
                    <h2>Password</h2>
                    <Link to="/">Change Password</Link>
                    {/*<ResetPwd >Change Password</ResetPwd>*/}
                </div>
                <div className="other-link" style={{fontWeight: "bold", marginBottom: 20}}>
                    <h2>Update annual membership fee</h2>
                    <SetMembershipFee/>
                </div>

            </Card>
        </div>
    )
}

