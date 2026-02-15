const {company} = require('../config')
const {feeModel} = require('../models')


/* Reset global system settings in terms of membership fee (system admin use only) */
exports.updateMembershipFee = (req, res) => {
    feeModel.findOneAndUpdate({company}, {membership_fee: req.body.membership_fee}, (err) => {
        if (err) {
            return res.handleMessage(err)
        }
        res.handleMessage('Membership fee updated!', 0)
    })
}

/* Get current membership fee value */
exports.getMembershipFee = async (req, res) => {
    const result = await feeModel.findOne({company})

    if (!result) {
        return res.handleMessage('Company fee information not found!')
    }
    res.send({
        membership_fee: result.membership_fee
    })
}

