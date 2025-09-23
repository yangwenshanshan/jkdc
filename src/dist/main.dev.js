"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _axios = _interopRequireDefault(require("axios"));

var _qs = _interopRequireDefault(require("qs"));

require("normalize.css");

var _elementUi = _interopRequireDefault(require("element-ui"));

require("./assets/css/element-variables.scss");

require("./assets/css/common.scss");

var _config = require("../config");

var _th = _interopRequireDefault(require("element-ui/src/locale/lang/th"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (process.env.NODE_ENV === 'development') {// require('./mock/index')
}

_vue["default"].config.productionTip = false;

_vue["default"].use(_elementUi["default"]);

_vue["default"].prototype.request = function (path, data) {
  var _this = this;

  var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'post';
  var responseType = arguments.length > 3 ? arguments[3] : undefined;
  var params = data;
  var loading,
      timer,
      ts = this;

  if (!params._hideLoading) {
    timer = setTimeout(function () {
      loading = ts.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)'
      });
    }, 2000);
  }

  return new Promise(function (resolve, reject) {
    var config = {
      method: method,
      url: _config.URL + path,
      withCredentials: true,
      responseType: responseType
    };

    if (method.toLocaleUpperCase() === 'GET') {
      if (data) {
        config.params = data;
      }
    } else {
      config.data = params;
    }

    (0, _axios["default"])(config).then(function (res) {
      if (res.data.code === 200 || res.status === 200) {
        resolve(res.data);
      } else if (res.data.code === 401) {
        localStorage.removeItem('user');

        if (_this.$route.path !== '/login') {
          _this.$message('登录状态过期');

          _this.$router.replace('/login');
        }
      } else {
        // this.$message.error('请求出错！');
        reject(res.data);
      }
    })["catch"](function () {
      // this.$message.error('请求出错！');
      reject();
    })["finally"](function () {
      if (timer !== undefined) {
        if (loading) {
          // 已显示加载中
          loading.close();
        } else {
          clearTimeout(timer);
        }
      }
    });
  });
};

new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');