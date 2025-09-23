<template>
    <div class="container">
        <div class="left"></div>
        <div class="right">
            <div class="sign-in">
                <div class="title">试用账号申请</div>
                <el-form label-position="right" label-width="80px" :model="signUp">
                    <el-form-item label="称谓">
                        <el-input v-model="signUp.username" placeholder="请输入称谓"></el-input>
                    </el-form-item>
                    <el-form-item label="电话">
                        <el-input v-model="signUp.userPhone" placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="signUp.userEmail" placeholder="请输入邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="公司">
                        <el-input v-model="signUp.company" placeholder="请输入公司"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div class="verify">
                            <el-input v-model="signUp.code" placeholder="请输入验证码"></el-input>
                            <img src="" alt="code" class="img" ref="verifyCode">
                            <el-link class="get-code" @click="setVerifyCode">获取验证码</el-link>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="tip">
                            <span class="red">温馨提示：</span>：此产品为收费产品，短期试用不收取费用。请您准确填写注册信息，以便及时获得试用账号。
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <div class="btn-group">
                            <el-button type="primary" class="btn" @click="register">提交申请</el-button>
                            <el-button type="info" class="btn" @click="back">取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {URL} from './../../config'
    import {check} from './../assets/js/utils'
    export default {
        name: "Register",
        data: function () {
            return {
                signUp: {
                    company: '', // 公司
                    userEmail: '', // 邮箱
                    userPhone: '', // 手机号
                    code: '', // 用户输入的验证码
                    random : '', // 系统生成的验证码
                    username: '', // 用户名
                },
            }
        },
        methods:{
            register(){
                if(!this.signUp.username){
                    this.$message({
                        message: '请填写称谓',
                        type: 'warning'
                    });
                    return
                }
                if(!this.signUp.userPhone){
                    this.$message({
                        message: '请填写手机号',
                        type: 'warning'
                    });
                    return
                } else if(!check(this.signUp.userPhone, 'phone')) {
                    this.$message({
                        message: '手机号格式不正确',
                        type: 'warning'
                    });
                    return
                }
                if(!this.signUp.userEmail){
                    this.$message({
                        message: '请填写邮箱',
                        type: 'warning'
                    });
                } else if(!check(this.signUp.userEmail, 'email')) {
                    this.$message({
                        message: '邮箱格式不正确',
                        type: 'warning'
                    });
                    return
                }
                if(!this.signUp.company){
                    this.$message({
                        message: '请填写公司名称',
                        type: 'warning'
                    });
                    return;
                }

                this.request('/trialAccountApplication',{
                    company: this.signUp.company,
                    userEmail: this.signUp.userEmail,
                    userPhone: this.signUp.userPhone,
                    code: this.signUp.code,
                    username: this.signUp.username,
                }).then(res => {
                    this.$alert('您的申请我们已收到，我们的工作人员将尽快联系您。', '试用账号申请成功', {
                        confirmButtonText: '确定'
                    });
                },res => {
                    this.$message.error(res.msg)
                });
            },
            back(){
                this.$router.push('/login')
            },
            setVerifyCode(){
                this.$refs.verifyCode.src = URL + 'getVerify?t=' + (new Date().getTime())
            }
        },
        mounted() {
            this.setVerifyCode();
        }
    }
</script>


<style scoped lang="scss">
    .container{
        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
        min-height: 100vh;
        margin: auto;
        background: #F5F6FA;

        .left{
            height: 680px;
            background: #ddd;
            width: 578px;
            background: url("./../assets/images/login-gb.png") center no-repeat;
        }
        .right{
            height: 680px;
            background: #fff;
            width: 578px;
        }
    }
    .sign-in{
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        align-items: center;
        width: 428px;
        margin: 0 auto;
        .title{
            font-size: 24px;
            color: #333333;
            font-weight: 400;
            width: 100%;
            margin-bottom: 48px;
            text-align: center;
        }
        .btn{
            width: 100%;
            margin-top: 40px;
        }
        .link-wrap{
            width: 100%;
            margin-top: 13px;
            text-align: center;
        }
        .link{
            color: #09958D;
            text-decoration: none;
            font-size: 16px;
        }
        .btn-group{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .btn{
                width: 162px;
                margin-top: 0;
            }
        }
        .tip{
            background: #EFF1F9;
            padding: 13px 15px;
            font-size: 12px;
            line-height: 20px;
        }
    }
</style>
<style lang="scss">
    .sign-in{
        .el-form{
            width: 100%;
        }
        .el-form-item__label{
            color: #333;
            font-size: 16px;
        }
        .el-input__inner{
            font-size: 16px;
        }


        .verify{
            display: flex;
            align-items: center;
            align-content: center;
            .el-input{
                width: 140px;
                min-width: auto;
            }
            .el-input__inner{
                width: 140px;
                min-width: auto;
            }
            .img{
                width: 87px;
                height: 36px;
                margin: 0 10px;
            }
            .get-code{
                line-height: 1.4;
            }
        }
    }
</style>

