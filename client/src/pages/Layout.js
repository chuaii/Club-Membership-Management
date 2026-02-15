import {BellOutlined, CalendarOutlined, HomeOutlined, LogoutOutlined, SendOutlined, SettingOutlined, ShoppingOutlined, TeamOutlined, UserAddOutlined, UserOutlined} from '@ant-design/icons';
import {Layout, Menu, Popconfirm} from 'antd';
import {observer} from 'mobx-react-lite'
import './Layout.css'
import React, {useEffect, useState} from 'react';
import {Link, Outlet, useLocation} from "react-router-dom";
import {useStore} from "../store";


const {Header, Sider} = Layout;
const navigationMenu = [
    {
        label: <Link to={'/'}>nav1</Link>,
    },
    {
        label: <Link to={'/'}>nav2</Link>,
    }
]
const siderMemberMenus = [
    {
        key: '/',
        icon: <HomeOutlined/>,
        label: <Link to="/">Home</Link>,
    },
    {
        key: '/profile',
        icon: <UserOutlined/>,
        label: <Link to="/profile">My Profile</Link>,
    },
    {
        key: '/settings',
        icon: <SettingOutlined/>,
        label: <Link to="/settings">Settings</Link>,
    },
    {
        key: '/membership',
        icon: <ShoppingOutlined/>,
        label: <Link to="/membership">Membership</Link>,
    },
    {
        key: '/notification',
        icon: <BellOutlined/>,
        label: <Link to="/notification">Notification</Link>,
    },
]
const siderMembershipAdminMenus = [
    {
        key: '/',
        icon: <HomeOutlined/>,
        label: <Link to="/">Home</Link>,
    },
    {
        key: '/member-list',
        icon: <TeamOutlined/>,
        label: <Link to="/member-list">Member List</Link>,
    },
    {
        key: '/send-email',
        icon: <SendOutlined/>,
        label: <Link to="/send-email">Send Email</Link>
    },
    {
        key: '/send-card-list',
        icon: <BellOutlined/>,
        label: <Link to="/send-card-list">Membership Card</Link>,
    },
]
const siderSystemAdminMenus = [
    {
        key: '/',
        icon: <HomeOutlined/>,
        label: <Link to="/">Home</Link>,
    },
    {
        key: '/register-staff',
        icon: <UserAddOutlined/>,
        label: <Link to="/register-staff">Register Staff</Link>,
    },
    {
        key: '/staff-list',
        icon: <TeamOutlined/>,
        label: <Link to="/staff-list">Staff List</Link>,
    },
    {
        key: '/system-settings',
        icon: <SettingOutlined/>,
        label: <Link to="/system-settings">System Settings</Link>
    }
]
const siderManagementUserMenus = [
    {
        key: '/',
        icon: <HomeOutlined/>,
        label: <Link to="/">Home</Link>,
    },
    {
        key: '/view-audit',
        icon: <UserOutlined/>,
        label: <Link to="/view-audit">Audit History</Link>,
    },
    {
        key: '/view-filter-result',
        icon: <CalendarOutlined/>,
        label: <Link to="/view-filter-result">Account Status</Link>,
    },
    {
        key: '/view-membership-duration',
        icon: <UserOutlined/>,
        label: <Link to="/view-membership-duration">Membership Duration</Link>,
    },
]


const MainLayout = () => {
    const {pathname} = useLocation()
    const {loginStore, userStore} = useStore()
    const role = loginStore.user_role
    const [userInfo, setUserInfo] = useState({
        name: loginStore.firstname + ' ' + loginStore.lastname
    })

    const onConfirm = () => {
        loginStore.logout()
        window.location.reload()
    }

    useEffect(() => {
        const loadInfo = async () => {
            let userData

            if (role === 'Club Member') {
                userData = await userStore.getMemberInfo(loginStore.member_id)
            } else if (role === 'Membership Admin' || role === 'System Admin' || role === 'Club Management User') {
                userData = await userStore.getStaffInfo(loginStore.staff_id)
            }
            if (userData) {
                setUserInfo({
                    name: userData.firstname + ' ' + userData.lastname
                })
            }
        }
        loadInfo()
    }, [role, loginStore.member_id, loginStore.staff_id, userStore])

    return (
        <Layout style={{height: "100vh"}}>
            <Header className="header">
                <div className="header-info">
                    <span className="header-left-conner">
                        <a className="header-logo" href="/">GREEN SPACE</a>
                    </span>
                    <span className="header-left-conner">
                        <Menu theme="dark" mode="horizontal" items={navigationMenu}/>
                    </span>
                    <span>
                        <a className="header-logout">
                            <Popconfirm onConfirm={onConfirm} title="Ready to exit?" okText="Exit" cancelText="Cancel">
                                <LogoutOutlined/> Logout
                            </Popconfirm>
                        </a>
                    </span>
                    <span className="header-userinfo">
                        Hi, {userInfo.name}
                    </span>
                </div>
            </Header>

            <Layout>
                {role === 'Club Member' && (
                    <Sider className="site-layout-background" width={190}>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={[pathname]}
                            items={siderMemberMenus}
                            style={{height: '100%', fontSize: 'large'}}
                        />
                    </Sider>
                )}
                {role === 'Membership Admin' && (
                    <Sider className="site-layout-background" width={220}>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={[pathname]}
                            items={siderMembershipAdminMenus}
                            style={{height: '100%', fontSize: 'large'}}
                        />
                    </Sider>
                )}
                {role === 'System Admin' && (
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={[pathname]}
                            items={siderSystemAdminMenus}
                            style={{height: '100%', fontSize: 'large'}}
                        />
                    </Sider>
                )}
                {role === 'Club Management User' && (
                    <Sider className="site-layout-background" width={250}>
                        <Menu
                            mode="inline"
                            theme="light"
                            defaultSelectedKeys={[pathname]}
                            items={siderManagementUserMenus}
                            style={{height: '100%', fontSize: 'large'}}
                        />
                    </Sider>
                )}
                <Layout className="layout-content" style={{padding: 20}}>
                    <Outlet/>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default observer(MainLayout)
