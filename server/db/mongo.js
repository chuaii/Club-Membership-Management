// macOS start command:
// mongod --dbpath /usr/local/var/mongodb --logpath /usr/local/var/log/mongodb/mongo.log --fork
const mongoose = require('mongoose')
const {company, databaseURL, fee, sysAdmin} = require('../config')
const {feeModel, staffModel} = require('../models')


const initSystemAdmin = () => {
    const userInfo = sysAdmin
    const staff_id = userInfo.staff_id
    const user_role = userInfo.user_role

    // Add system admin staff to the database
    staffModel.countDocuments({staff_id}, (err, result) => {
        if (err) {
            console.log(err)
        }
        if (result > 0) {  // Already exist this staff id
            console.log('Staff ID is occupied!')
        } else {
            staffModel.create(userInfo, (err) => {
                if (err)
                    throw Error(err)
                else
                    console.log(`Insert [${user_role}: ${staff_id}] successfully!`)  // insert to the database successfully
            })
        }

    })

}

const initCompanySystem = () => {
    // Initialize default fee
    feeModel.countDocuments({company: company}, (err, result) => {
        if (err) {
            console.log('Failed: ', err)
        } else if (result === 0) {  // Initialize default values if this company name doesn't exist
            feeModel.create({company: company, membership_fee: fee}, (err) => {
                if (err)
                    throw Error(err)
                else
                    console.log('Register company basic information successfully!')
            })
            initSystemAdmin()
        }
    })
}


/* Connect to MongoDB database */
exports.createConnection = () => {
    return mongoose.connect(databaseURL)
        .then(() => {
            console.log('Database is connected...')
            initCompanySystem()  // init basic role and conditions
        })
        .catch((reason) => {
            console.log('Fail to connect to MongoDB database: ', reason)
        })
}
