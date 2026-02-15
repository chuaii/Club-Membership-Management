/******************************************************************************************
 *
 * Home.js
 *
 * This is the main home page.
 *
 ******************************************************************************************/
import React, {useEffect, useState} from "react";
import "./Home.css";
import home_img from '../assets/home.png'
import {useStore} from "../store";


export default function Home() {
    const millisecondsADay = 1000 * 60 * 60 * 24
    const {loginStore, userStore} = useStore()
    const [userInfo, setUserInfo] = useState({
        name: loginStore.firstname + ' ' + loginStore.lastname,
        membership: loginStore.membership_status,
        expireDate: loginStore.expire_date
    })

    const isExpireInOneMonth = (expireDate) => {
        return new Date(expireDate).getTime() < new Date().getTime() + millisecondsADay * 30
    }

    const calculateRemainDays = (expireDate) => {
        return Math.ceil((new Date(expireDate).getTime() - new Date().getTime()) / millisecondsADay)
    }

    useEffect(() => {
        const loadInfo = async () => {
            const role = loginStore.user_role
            let userData

            if (role === 'Club Member') {
                userData = await userStore.getMemberInfo(loginStore.member_id)
            } else if (role === 'Membership Admin' || role === 'System Admin' || role === 'Club Management User') {
                userData = await userStore.getStaffInfo(loginStore.staff_id)
            }
            if (userData) {
                setUserInfo({
                    name: userData.firstname + ' ' + userData.lastname,
                    membership: userData.membership_status,
                    expireDate: userData.expire_date
                })
            }
        }
        loadInfo()
    }, [loginStore.user_role, loginStore.member_id, loginStore.staff_id, userStore])

    return (
        <div className="home-page">
            <div className="home-page-content">
                <div className="userinfo-title">
                    Welcome back, {userInfo.name}!
                    <br/>
                    {userInfo.membership ? '😍 You are' : '😢 You are not'} our membership
                    <br/>
                    {userInfo.membership ? `${isExpireInOneMonth(userInfo.expireDate) ? `Your membership is expire in ${calculateRemainDays(userInfo.expireDate)} day(s)` : ''}` : ''}
                </div>
                <div className="home-page-image">
                    <img src={home_img} alt="homePageImage"/>
                </div>
            </div>
        </div>
    )
}
