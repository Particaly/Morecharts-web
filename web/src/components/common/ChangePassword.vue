<template>
	<div class="ChangePassword">
		<div class="input-label">
			<span>旧密码</span><Input v-model="oldpsw" placeholder="请输入当前密码" style="width: 300px" />
		</div>
		<div class="input-label">
			<span>新密码</span><Input v-model="newpsw" placeholder="请输入新密码" style="width: 300px" />
		</div>
		<div class="input-label">
			<span>重复密码</span><Input v-model="repeatpsw" placeholder="请重复新密码" style="width: 300px" />
		</div>
	</div>
</template>

<script>
    export default {
        name: "ChangePassword",
		data:function(){
		    return {
                oldpsw: '',
                newpsw: '',
                repeatpsw: ''
		    }
		},
    }
</script>

<style scoped lang="scss">
.ChangePassword{
	background: #fff;
	position: relative;
	.input-label{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 15px auto;
		span{
			min-width: 66px;
			cursor: default;
		}

	}
	.input-label /deep/ .ivu-input{
		text-indent: 5px;
	}
}
</style>
