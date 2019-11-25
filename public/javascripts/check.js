var checkEmail = (email, regex) => {
    if (regex == null) {
        regex = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
    }
    return regex.test(email);
}