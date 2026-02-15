import {SearchOutlined} from '@ant-design/icons'
import {Breadcrumb, Button, Card, DatePicker, Form, Space, Table} from 'antd'
import React, {useEffect, useRef, useState} from 'react'
import {Link, useNavigate} from "react-router-dom";
import {useStore} from "../../store";
import {getFilterProps} from '../../utils'

const {RangePicker} = DatePicker;
 

export default function ViewFilterResult() {
    const [form] = Form.useForm()
    const {userStore} = useStore()
    const navigate = useNavigate()
    const searchInput = useRef(null)
    const [params, setParams] = useState({
        page: 1,
        per_page: 3
    })
    const [registeredMember, setRegisteredMember] = useState({
        list: [],
        count: 0
    })
    const [expiredMember, setExpiredMember] = useState({
        list: [],
        count: 0
    })
    const [renewedMember, setRenewedMember] = useState({
        list: [],
        count: 0
    })
    const [timeRange, setTimeRange] = useState('1970-01-02 2099-12-30')

    const pageChange = (page) => {
        setParams({
            ...params, page
        })
    }

    const viewMemberInfo = (data) => {
        navigate(`/profile?id=${data.member_id}`)
    }

    const getColumnSearchProps = (dataIndex) => (
        getFilterProps(dataIndex, searchInput)
    )

    const columns = [
        {
            title: 'Member ID',
            dataIndex: 'member_id',
            key: 'member_id',
            ...getColumnSearchProps('member_id'),
            sorter: (a, b) => a.member_id.localeCompare(b.member_id),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Register Date',
            dataIndex: 'registered_date',
            key: 'registered_date',
            ...getColumnSearchProps('registered_date'),
            sorter: (a, b) => a.registered_date.localeCompare(b.registered_date),
        },
        {
            title: 'Expire Date',
            dataIndex: 'expire_date',
            key: 'expire_date',
            ...getColumnSearchProps('expire_date'),
            sorter: (a, b) => a.expire_date.localeCompare(b.expire_date),
        },
        {
            title: 'Renewal Date',
            dataIndex: 'recent_renewal_date',
            key: 'recent_renewal_date',
            ...getColumnSearchProps('recent_renewal_date'),
            sorter: (a, b) => a.recent_renewal_date.localeCompare(b.recent_renewal_date),
        },
        {
            title: 'Operation',
            render: data => {
                return (
                    <Space size="middle">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SearchOutlined/>}
                            onClick={() => viewMemberInfo(data)}
                        />
                    </Space>
                )
            }
        }
    ]

    const buildMemberList = (members) => {
        const memberList = members.record_list
        const size = memberList.length
        let list = []

        for (let i = 0; i < size; i++) {
            const user = memberList[i]
            let formatData = {
                ...user,
                name: user.firstname + ' ' + user.middle_name + ' ' + user.lastname,
                key: `${i}`
            }
            list.push(formatData)
        }
        return list
    }

    const formatDateString = (date) => {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0')
    }

    const onFinish = (values) => {
        const start = formatDateString(new Date(values.time_range[0]._d))
        const end = formatDateString(new Date(values.time_range[1]._d))
        const range = start + ' ' + end
        setTimeRange(range)
    }

    const onFinishFailed = (err) => {
        console.log('Failed: ', err)
    }

    const resetForm = () => {
        form.resetFields()
        setTimeRange('1970-01-02 2099-12-30')
    }

    // load member list
    useEffect(() => {
        const loadList = async () => {
            const registered = await userStore.getNewRegisteredList({params}, timeRange)
            const expired = await userStore.getExpiredList({params}, timeRange)
            const renewed = await userStore.getRenewedList({params}, timeRange)
            let memberList

            memberList = buildMemberList(registered)
            setRegisteredMember({
                list: memberList,
                count: memberList.length,
            })

            memberList = buildMemberList(expired)
            setExpiredMember({
                list: memberList,
                count: memberList.length,
            })

            memberList = buildMemberList(renewed)
            setRenewedMember({
                list: memberList,
                count: memberList.length,
            })
        }
        loadList()
    }, [params, timeRange])

    return (
        <Card
            title={
                <Breadcrumb separator=">">
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>Member Account Status List</Breadcrumb.Item>
                </Breadcrumb>
            }
            style={{marginBottom: 20}}
        >
            <Form
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                form={form}
                style={{marginBottom: 20}}
            >
                <Form.Item
                    name="time_range"
                    style={{display: 'inline-block'}}
                    rules={[{required: true, message: 'Please pick a time range!'}]}
                >
                    <RangePicker/>
                </Form.Item>
                <Form.Item style={{display: 'inline-block'}}>
                    <Button type="primary" htmlType="submit" shape="round" style={{marginLeft: 30}}>
                        Filter
                    </Button>
                    <Button type="ghost" onClick={resetForm} shape="round" style={{marginLeft: 10}}>
                        Reset
                    </Button>
                </Form.Item>
            </Form>

            <h2>{registeredMember.count} new registered members in total</h2>
            <Table
                columns={columns}
                dataSource={registeredMember.list}
                pagination={{
                    pageSize: params.per_page,
                    total: registeredMember.count,
                    onChange: pageChange
                }}
            />
            <h2>{expiredMember.count} expired members in total</h2>
            <Table
                columns={columns}
                dataSource={expiredMember.list}
                pagination={{
                    pageSize: params.per_page,
                    total: expiredMember.count,
                    onChange: pageChange
                }}
            />
            <h2>{renewedMember.count} renewed members in total</h2>
            <Table
                columns={columns}
                dataSource={renewedMember.list}
                pagination={{
                    pageSize: params.per_page,
                    total: renewedMember.count,
                    onChange: pageChange
                }}
            />
        </Card>
    )
}

