<template>
    <div class="no-permission">
        <div class="remind">
            <p>
                很抱歉，您的账号没有该模块使用权限
            </p>
            <p>
                如需帮助，请联系极客助理：17801770662
            </p>
            <img src="../assets/images/limited.svg" alt="" />
        </div>
    </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.no-permission {
    position: relative;
    .remind {
        font-size: 16px;
        color: #929aa8;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        p {
            padding: 4px 0;
            margin-left: 30px;
        }
    }
}
</style>
