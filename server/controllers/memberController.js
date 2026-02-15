const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {jwtSecretKey, expiresIn} = require('../config')
const {memberModel} = require('../models')
const {getUserById, formatDateString, calculateDates} = require('./memberFunctions')


/* Update value(s) in the database by given (Obj_id, update object, operation message, response) */
const updateByObjId = (id, update, msg, res) => {
    memberModel.findByIdAndUpdate(id, update, (err) => {
        if (err) {
            return res.handleMessage(err)
        }
        console.log(msg)
    })
}

/* Get member user id, and then call updateByObjId function to update things in MongoDB database */
const updateInfo = (member_id, update, operationMsg, res) => {
    getUserById(memberModel, member_id)
        .then(member => {
            if (!member) {
                return res.handleMessage('User does not exist!')
            }
            updateByObjId(member._id, {$set: update}, `${operationMsg} successfully!`, res)
            res.handleMessage(`${operationMsg} successfully!`, 0)
        })
        .catch(err => {
            throw Error(err)
        })
}

/* Get the date of last Monday by passing JS Date */
const getLastMonday = (date) => {
    date.setDate(date.getDate() - 7 - date.getDay() + 1)
    return formatDateString(date)
}


/* Sign up a new member */
exports.signup = (req, res) => {
    const {pay_now, amount, agreement, ...userInfo} = req.body  // delete agreement, and get payment condition
    const member_id = userInfo.member_id

    memberModel.countDocuments({member_id}, (err, result) => {
        if (err) {
            return res.handleMessage(err)
        }
        if (result > 0) {  // Already exist this member id
            return res.handleMessage('Member ID is occupied!')
        } else {
            userInfo.password = bcrypt.hashSync(userInfo.password, 10)

            memberModel.create(userInfo, (err) => {
                if (err) {
                    return res.handleMessage(err)
                }
                // insert to the database successfully
                console.log(`Insert [${userInfo.user_role}: ${member_id}] successfully!`)

                res.send({
                    status: 0,
                    message: 'Register successfully!',
                    member_id,
                    pay_now,
                    amount
                })
            })
        }

    })
}

/* Before login, check whether this user's account is locked or not */
exports.checkLocked = (req, res) => {
    getUserById(memberModel, req.body.member_id)
        .then(member => {
            if (!member) {
                return res.handleMessage('Wrong Member ID!')
            }
            res.send({
                status: 0,
                account_locked: member.account_locked
            })
        })
        .catch(err => {
            throw Error(err)
        })
}

/* Login to user account */
exports.login = (req, res) => {
    const userInfo = req.body
    const member_id = userInfo.member_id
    const password = userInfo.password

    getUserById(memberModel, member_id)
        .then(member => {
            if (!member) {
                return res.handleMessage('Wrong Member ID!')
            }
            // if the fail login counts of user's account is more than a certain value, update account_lock attribute to true
            if (member.fail_login_count >= 4) {
                updateByObjId(member._id, {$set: {account_locked: true}}, `Your account [${member_id}] is locked`, res)
            }
            // Check and match password between database
            const compareResult = bcrypt.compareSync(password, member.password)
            // Match password correctness, if wrong, fail_login_count +1
            if (!compareResult) {  // member.password !== password
                updateByObjId(member._id, {$inc: {fail_login_count: 1}}, `[${member_id}] failure login count +1`, res)
                return res.handleMessage('Wrong password!')
            }

            // If password is matched, clear and reset fail_login_count value to 0
            updateByObjId(member._id, {fail_login_count: 0}, `Club member [${member_id}] login successfully!`, res)
            const userObj = {...member._doc, password: ''}
            const {fail_login_count, __v, ...rest} = userObj
            const {firstname, lastname, user_role, membership_status, expire_date} = rest

            // TODO user_role加密
            // Create JSON web token
            const token = jwt.sign(
                rest,
                jwtSecretKey,
                {expiresIn}
            )

            res.send({
                status: 0,
                token,
                member_id,
                firstname,
                lastname,
                user_role,
                membership_status,
                expire_date
            })
        })
        .catch(err => {
            throw Error(err)
        })
}


/* Get user information */
/* Switch membership status of members */
exports.getActiveMemberList = async (req, res) => {
    const members = await memberModel.find({
        membership_status: true
    })
    res.send({
        member_list: members
    })
}

exports.activateMember = async (req, res) => {
    const member = await getUserById(memberModel, req.body.member_id)

    if (!member) {
        return res.handleMessage('Wrong Member ID!')
    }
    const {expire_date, effective_date} = calculateDates(member)  // Calculate expire_date and effective_date
    const recent_renewal_date = formatDateString(new Date())  // To be today

    updateInfo(
        req.body.member_id,
        {
            membership_status: true,
            expire_date,
            effective_date,
            recent_renewal_date,
        },
        (member.recent_renewal_date === 'Never renew') ?
            'Activate membership' : 'Renew membership',  // Activate for new member, Renew for existing member
        res
    )
}

exports.getInactiveMemberList = async (req, res) => {
    const members = await memberModel.find({
        membership_status: false
    })
    res.send({
        member_list: members
    })
}

exports.deactivateMember = (req, res) => {
    updateInfo(
        req.body.member_id,
        {membership_status: false, expire_date: formatDateString(new Date())},
        'Deactivate member',
        res
    )
}

/* Get a member's personal information */
exports.getMemberProfile = (req, res) => {
    const member_id = req.params.id

    getUserById(memberModel, member_id)
        .then(member => {
            if (!member) {
                return res.handleMessage('User does not exist!')
            }
            const {
                member_id, firstname, middle_name, lastname, gender, birthday_year, birthday_month,
                birthday_date, address_line1, address_line2, address_line3, address_city, address_country,
                address_postalcode, email, phone, registered_date, effective_date, expire_date, membership_status
            } = member

            res.send({
                member_id, firstname, middle_name, lastname, gender, birthday_year, birthday_month,
                birthday_date, address_line1, address_line2, address_line3, address_city, address_country,
                address_postalcode, email, phone, registered_date, effective_date, expire_date, membership_status
            })
        })
        .catch(err => {
            throw Error(err)
        })
}


/* Update attributes */
exports.updateMemberInfo = (req, res) => {
    updateInfo(
        req.body.member_id,
        req.body,
        'Update',
        res
    )
}

/* In-app password change by user themselves, requires member old password to easily make a change */
exports.updatePassword = (req, res) => {
    const member_id = req.body.member_id
    const oldPassword = req.body.oldPassword

    getUserById(memberModel, member_id)
        .then(member => {
            if (!member) {
                return res.handleMessage('User does not exist!')
            }
            // Determine if the submitted old password is correct
            const compareResult = bcrypt.compareSync(oldPassword, member.password)
            // oldPassword !== member.password
            if (!compareResult) {
                return res.handleMessage('The old password is wrong!')
            }
            const newPassword = bcrypt.hashSync(req.body.newPassword, 10)
            updateByObjId(member._id, {$set: {password: newPassword}}, 'Password changed!', res)

            res.handleMessage('Password changed!', 0)
        })
        .catch(err => {
            throw Error(err)
        })
}

/* For users who forgot password and reset through security code */
exports.resetPassword = (req, res) => {
    const newPassword = bcrypt.hashSync(req.body.password, 10)

    updateInfo(
        req.body.member_id,
        {password: newPassword, account_locked: false, fail_login_count: 0},
        'Password reset',
        res
    )
}


/* Emails/Notifications send, receive, and delete operations*/
// Send
exports.sendGroupEmail = (req, res) => {
    memberModel.updateMany(
        {membership_status: true},
        {$push: {"notifications": {"title": req.body.title, "content": req.body.content}}},
        (err) => {
            if (err) console.log(err)
            res.handleMessage('Email already sent', 0)
        })
}

// Receive
exports.getNotification = (req, res) => {
    getUserById(memberModel, req.params.id)
        .then(member => {
            if (!member) {
                return res.handleMessage('Wrong Member ID!')
            }
            res.send({
                notifications: member.notifications
            })
        })
        .catch(err => {
            throw Error(err)
        })
}

// Delete
exports.deleteNotification = (req, res) => {
    memberModel.updateOne(
        {member_id: req.body.member_id},
        {$pull: {"notifications": {"content": req.body.notificationContent}}},
        (err) => {
            if (err) {
                console.log(err)
            }
            res.handleMessage('This notification delete', 0)
        })
}

/* Membership cards' operations */
// Request card. New member: get a new card, existing member: request a replacement
exports.requestReplaceCard = (req, res) => {
    updateInfo(
        req.body.member_id,
        {has_card: false},
        'Request new membership card',
        res
    )
}

/* After responses to each sending card request, set that member user as waiting to receive, and set "has_card" to true */
exports.deliverCard = (req, res) => {
    updateInfo(
        req.body.member_id,
        {has_card: true},
        'Membership card will deliver soon',
        res
    )
}

/* Get member list of whom newly registered since last Monday */
exports.getSendCardList = async (req, res) => {
    const members = await memberModel.find({
        has_card: false,
        membership_status: true,
        effective_date: {$gte: getLastMonday(new Date())}
    })

    if (!members) {
        res.handleMessage('Fail to get send card member list.')
    } else {
        res.send({
            member_list: members
        })
    }
}

/* Get member list of whom request a replacement of membership card */
exports.getReplaceCardList = async (req, res) => {
    const members = await memberModel.find({
        has_card: false,
        membership_status: true,
        effective_date: {$lt: getLastMonday(new Date())}
    })

    if (!members) {
        res.handleMessage('Fail to get send card member list.')
    } else {
        res.send({
            member_list: members
        })
    }
}


