<template>
    <div class="MakeNewProject">
        <div class="input-label">
            <span>项目名称</span><Input v-model="name" :maxlength="8" placeholder="请输入项目名称（必填）" style="width: 300px" />
        </div>
        <div class="input-label">
            <span>项目描述</span><Input v-model="discribe" :maxlength="100" show-word-limit type="textarea" placeholder="请输入项目描述（可选）" style="width: 300px" />
        </div>
    </div>
</template>

<script>
	export default {
		name: "MakeNewProject",
        data: function(){
            return {
	            name: '',
	            discribe: ''
            }
        },
	}
</script>

<style scoped lang="scss">
.MakeNewProject{
    background: #fff;
    position: relative;
    .input-label{
        display: flex;
        justify-content: space-around;
        align-items: flex-start;
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
