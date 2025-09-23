"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.check = check;
exports.checkLogin = checkLogin;
exports.checkAuth = checkAuth;

function check(str, type) {
  switch (type) {
    case 'phone':
      //手机号码
      return /^1\d{10}$/.test(str);

    case 'email':
      // 邮箱
      return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
  }
}

function checkLogin() {
  var user = localStorage.getItem('user');
  user && (user = JSON.parse(user));
  return !!user;
}

function checkAuth(auth, ts, down) {
  var user = localStorage.getItem('user');
  user && (user = JSON.parse(user));

  if (user) {
    if (user[auth]) {
      return true;
    } else {
      if (down) {
        ts && ts.$message.warning('很抱歉，您的账号没有该模块下载权限。如需帮助，请联系极客助理：17801770662');
      } else {
        ts && ts.$message.warning('很抱歉，您的账号没有该模块使用权限。如需帮助，请联系极客助理：17801770662');
      }
    }
  } else {
    return false;
  }
}