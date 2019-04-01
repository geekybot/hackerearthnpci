function validateMobileNo(mob) {
    if (/^\d{10}$/.test(mob)) {
        return true;
    } else {
        return false
    }
}

function validateEmail(emailField) {
    if (/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(emailField)) {
        return true;
    }
    else {
        return false;
    }

}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}




exports.validateEmail = validateEmail;
exports.validateMobileNo = validateMobileNo;
exports.generateRandomNumber = generateRandomNumber;