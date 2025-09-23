function check(str, type) {
    switch (type) {
        case "phone": //手机号码
            return /^1\d{10}$/.test(str);
        case "email": // 邮箱
            return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
    }
}
function checkLogin() {
    let user = localStorage.getItem("user");
    user && (user = JSON.parse(user));
    return !!user;
}

function checkAuth(auth, ts, down) {
    let user = localStorage.getItem("user");

    user && (user = JSON.parse(user));
    return true;
}

function checkAdmin() {
    let user = JSON.parse(localStorage.getItem("user"));

    if (user.isAdmin) {
        return true;
    } else {
        return false;
    }
}

export { check, checkLogin, checkAuth, checkAdmin };
