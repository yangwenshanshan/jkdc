<template>
    <div class="container">
        <div class="left"></div>
        <div class="right">
            <div class="sign-in">
                <div class="title">登录</div>
                <el-form
                    label-position="top"
                    label-width="80px"
                    :model="signIn"
                >
                    <el-form-item label="用户名">
                        <el-input
                            v-model="signIn.userName"
                            onkeyup="this.value=this.value.replace(/\s+/g,'')"
                            placeholder="请输入用户名"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input
                            v-model="signIn.password"
                            onkeyup="this.value=this.value.replace(/\s+/g,'')"
                            type="password"
                            placeholder="请输入密码"
                        ></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="btn" @click="login"
                            >登录</el-button
                        >
                    </el-form-item>
                </el-form>
                <!-- <div class="link-wrap">
          <router-link to="/register" class="link">免费申请测试账号>></router-link>
        </div>-->
                <div class="appleAccount">
                    <span>申请试用联系助理</span>
                    <img src="../assets/images/wechat.png" />
                </div>
            </div>
            <div class="info">
                <a href="https://beian.miit.gov.cn/"
                    >备案号：京ICP备19058569号-2</a
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data: function() {
        return {
            signIn: {
                userName: "",
                password: ""
            }
        };
    },
    methods: {
        async login() {
            if (!this.signIn.userName) {
                this.$message("请输入用户名");
                return;
            }
            if (!this.signIn.password) {
                this.$message("请输入密码");
                return;
            }
            
            // 如果输入的不是邮箱，自动添加后缀 @customer.geekinsight.com.cn
            let email = this.signIn.userName
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
                email += "@customer.geekinsight.com.cn"
            }

            this.request("auth/login", {
                    email: email,
                    password: this.signIn.password
                }).then(
                    res => {
                        if (res.data) {
                            this.getUserInfo(res.data);
                        } else {
                            this.$message.error(res);
                        }
                    },
                    err => {
                        this.$message.error(err);
                    }
                )

            // const { data: users } = await this.request('users', {
            //     fields: [
            //         'email',
            //         'date_expired',
            //     ],
            //     filter: {
            //         email: {
            //             _eq: email.replace(/\s+/g,'')
            //         }
            //     }
            // }, 'GET')
            
            // if (users && users[0]) {
            //     const { date_expired } = users[0];
            //     if (new Date(date_expired).getTime() < new Date(
            //         `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
            //         ).getTime()) {
            //         this.$message.error('该账号使用期限到期，请联系极客助理');
            //         return;
            //     }
                
            // } else {
            //     this.$message.error('用户名不存在或密码不匹配');
            //     return;
            // }
            
        },
        getUserInfo(data) {
            localStorage.setItem("tokenData", JSON.stringify(data));
            this.request("users/me", "", "GET").then(res => {
                const { date_expired } = res.data;
                if (new Date(date_expired).getTime() < new Date(
                    `${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`
                    ).getTime()) {
                    this.$message.error('该账号使用期限到期，请联系极客助理');
                    return;
                }
                let accountInfo = res.data;
                localStorage.setItem("user", JSON.stringify(accountInfo));
                this.$router.replace("/report");
                // if (accountInfo.isAdmin === 0) {
                //     this.$router.replace("/userFinancialRegulation");
                // } else {
                //     this.$router.replace("/administrator");
                // }
            });
        }
    }
};
</script>

<style scoped lang="scss">
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    min-height: 100vh;
    margin: auto;
    background: #f5f6fa;

    .left {
        height: 680px;
        background: #ddd;
        width: 578px;
        background: url("./../assets/images/login.png") center no-repeat;
        background-size: contain;
    }
    .right {
        height: 680px;
        background: #fff;
        width: 578px;
        position: relative;
        .info {
            font-size: 16px;
            a {
                color: #999;
            }
            position: absolute;
            right: 0;
            bottom: -12%;
        }
    }
}
.sign-in {
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    // align-items: center;
    width: 372px;
    margin: 0 auto;
    .title {
        font-size: 24px;
        color: #333333;
        font-weight: 400;
        width: 100%;
        margin-bottom: 60px;
        text-align: center;
    }
    .btn {
        width: 100%;
        margin-top: 40px;
    }
    .link-wrap {
        width: 100%;
        margin-top: 13px;
        text-align: center;
    }
    .link {
        color: #09958d;
        text-decoration: none;
        font-size: 16px;
    }
    .appleAccount {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        font-size: 16px;
        color: #09958d;
        font-weight: 700;
        span {
            width: 75px;
            line-height: 30px;
        }
        img {
            width: 100px;
            height: 100px;
        }
    }
}
</style>
