const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {jwtSecretKey, expiresIn} = require('../config')
const {staffModel} = require('../models')


/* Get member users by given staff_id */
const getUserById = async (staff_id) => {
    let staff = null
    try {
        staff = await staffModel.findOne({staff_id})
    } catch (err) {
        throw Error(err)
    }
    return staff
}

/* Update value(s) in the database by given (Obj_id, update object, operation message, response) */
const updateInfo = (staff_id, update, msg, res) => {
    staffModel.findOneAndUpdate({staff_id}, {...update}, (err) => {
        if (err) {
            return res.handleMessage(err)
        }
        res.handleMessage(`${msg} successfully!`, 0)
    })
}


/* Register a new staff with staff's role by system admin */
exports.signup = (req, res) => {
    const userInfo = req.body
    const staff_id = userInfo.staff_id
    const user_role = userInfo.user_role

    staffModel.countDocuments({staff_id}, (err, result) => {
        if (err) {
            return res.handleMessage(err)
        }
        if (result > 0) {  // Already exist this staff id
            return res.handleMessage('Staff ID is occupied!')
        } else {
            userInfo.password = bcrypt.hashSync(userInfo.password, 10)

            staffModel.create(userInfo, (err) => {
                if (err) {
                    return res.handleMessage(err)
                }
                // insert to the database successfully
                console.log(`Insert [${user_role}: ${staff_id}] successfully!`)

                res.send({
                    status: 0,
                    message: 'Register successfully!',
                    staff_id,
                })
            })
        }

    })
}

exports.login = (req, res) => {
    const userInfo = req.body
    const staff_id = userInfo.staff_id
    const password = userInfo.password

    getUserById(staff_id)
        .then(staff => {
            if (!staff) {
                return res.handleMessage('Wrong Staff ID!')
            }
            // Check and match password between database
            const compareResult = bcrypt.compareSync(password, staff.password)
            // Match password correctness, if wrong, fail_login_count +1
            if (!compareResult) {  // password !== staff.password
                return res.handleMessage('Wrong password!')
            }
            const userObj = {...staff._doc, password: ''}
            const {__v, ...rest} = userObj
            const {firstname, lastname, user_role, membership_status} = rest
            // TODO user_role加密
            console.log(`Staff [${staff_id}] login successfully!`)

            const token = jwt.sign(
                rest,
                jwtSecretKey,
                {expiresIn}
            )
            res.send({
                status: 0,
                token,
                staff_id,
                firstname,
                lastname,
                user_role,
                membership_status
            })
        })
        .catch(err => {
            throw Error(err)
        })

}


/*Get staff list by membership different statuses*/
/*Update status for a staff*/

exports.getActiveStaffList = async (req, res) => {
    const staffs = await staffModel.find({
        membership_status: true
    })
    res.send({
        staff_list: staffs
    })
}

exports.activateStaff = (req, res) => {
    updateInfo(
        req.body.staff_id,
        {membership_status: true},
        'Activate staff',
        res
    )
}


exports.getInactiveStaffList = async (req, res) => {
    const staffs = await staffModel.find({
        membership_status: false
    })
    res.send({
        staff_list: staffs
    })
}

exports.deactivateStaff = (req, res) => {
    updateInfo(
        req.body.staff_id,
        {membership_status: false},
        'Deactivate staff',
        res
    )
}


exports.getStaffProfile = (req, res) => {
    const staff_id = req.params.id

    getUserById(staff_id)
        .then(staff => {
            if (!staff) {
                return res.handleMessage('User does not exist!')
            }
            const {staff_id, firstname, middle_name, lastname, email, phone, membership_status, user_role} = staff

            res.send({
                staff_id,
                firstname,
                middle_name,
                lastname,
                email,
                phone,
                membership_status,
                user_role
            })
        })
        .catch(err => {
            throw Error(err)
        })
}

exports.updateStaffInfo = (req, res) => {
    updateInfo(
        req.body.staff_id,
        req.body,
        'Update staff info',
        res
    )
}

