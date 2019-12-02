var checkEmail = (email, regex) => {
    if (regex == null) {
        regex = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    }
    return regex.test(email);
}

var trim = (str) => {
    try {
        return str.replace(/^\s+|\s+$/gm, '');
    } catch (err) {
        return null;
    }
}

var checkFileType = (str, postfix) => {
    var pos = str.lastIndexOf(".");
    var lastname = str.substring(pos, str.length);
    var resultName = lastname.toLowerCase();
    return postfix == resultName.toString();
}  