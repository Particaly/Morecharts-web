<template>
    <main class="container">
        <Split v-model="split">
            <div slot="left" class="js-editor" >
                <div class="header">
                    <div class="messages">{{message}}</div>
                    <div class="runner" @click="runScripts">运行</div>
                    <div class="floders" @click="showProps">{{isProps?'代码':'属性'}}</div>
                </div>
                <div class="editor" id="editor" v-show="!isProps"></div>
                <div class="props" v-show="isProps">
                    <div class="optionsline">
                        <div class="o-title">图表名称：</div>
                        <input type="text" v-model="chartName" @blur="triggerSave({
                            name:chartName,
                            type:chartType,
                            tag:chartTags
                        },false)" />
                    </div>
                    <div class="optionsline">
                        <div class="o-title">图表类型：</div>
                        <label for="charttype">
                            <input type="radio" id="charttype" checked="checked">
                            Echarts
                        </label>
                    </div>
                    <div class="optionsline" style="align-items: flex-start">
                        <div class="o-title">图表标签：</div>
                        <div class="tags">
                            <Tag v-for="(item,key) in chartTags"
                                 size="large"
                                 :key="item"
                                 :name="item"
                                 closable
                                 @on-close="handleClose2"
                            >
                                <span class="tag-input"
                                   @blur="saveTagChange(key)"
                                   :ref="'tag'+key"
                                   contenteditable="true"
                                >{{item}}</span>
                            </Tag>
                            <Button icon="ios-add" type="dashed" @click="handleAdd">添加标签</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="right" class="right-holder" >
                <div class="charter" ref="chart"></div>
            </div>
        </Split>
    </main>
</template>

<script>
    let editor,chart,savetimer,resizetimer,tempimg;
	export default {
		name: "Editor",
        data: function(){
            return {
	            split: 0.43,
                type: '',
                value: '',
                id:'',
	            message: '',
                isAttribute: false,
                rendered: false,
	            isProps: false,
	            chartName: '',
                chartType: 'Echarts',
	            chartTags: []
            }
        },
        watch:{
	        split:function () {
                if(chart){
                	if(resizetimer){
                		clearTimeout(resizetimer)
                    }
	                resizetimer = setTimeout(() => {
		                chart.resize()
	                },300)
                }
	        },
        },
        computed:{
			query: function() {
				return this.$route.query
            },
        },
        created() {
			if(this.query.id){
				this.id = this.query.id
            }
			window.ds = this;
			let id = window.sessionStorage.getItem(window.location.href);
			if(id){
				this.id = id;
            }
            this.createScript();
        },
        methods: {
			// 创建editor插件的script标签
            createScript() {
            	let list = [
		            'https://cdn.bootcss.com/ace/1.4.6/ace.js',
            		'https://cdn.bootcss.com/ace/1.4.6/ext-language_tools.js',
                ];
            	let count = 0;
	            creater.bind(this)(list);
            	function creater(param){
		            for(let item of param){
			            let srcipts = document.createElement('script');
			            srcipts.src = item;
			            srcipts.onload = checker.bind(this);
			            document.body.appendChild(srcipts);
		            }
                }
                function checker(){
	                count++;
	                if(count === list.length){
	                	this.onScriptReady()
                    }
                }
            },
            // editor插件加载完毕后执行
            onScriptReady() {
	            editor = ace.edit("editor", {
		            theme: "ace/theme/monokai",
		            mode: "ace/mode/javascript",
		            selectionStyle: "text",
		            autoScrollEditorIntoView: true,
		            enableBasicAutocompletion: true,
		            enableSnippets: true,
		            enableLiveAutocompletion: true
	            });
	            this.getChartInfo();
            },
            // 编辑器内容发生更改，绑定事件
            addListenerToEditor() {
            	let first = true;
	            editor.session.on('change', (delta) => {
		            let value = editor.getValue(),
			            name = this.chartName,
                        type = this.chartType,
                        tag = this.chartTags;
		            if(this.value!==value){
			            this.value = value;
			            if(first){
			            	this.runScripts();
                        }
			            if(savetimer){
				            clearTimeout(savetimer);
			            }
			            savetimer = setTimeout(() => {
			            	if(first){
					            first = false;
                            }else{
					            this.runScripts();
                            }
				            this.triggerSave({name,tag,type});
			            },1500)
                    }else{
			            if(savetimer){
				            clearTimeout(savetimer);
			            }
                    }
	            });
            },
            // 生成注释到编辑器
            generateWord(text) {
            	this.$nextTick(() => {
            		if(editor){
			            editor.insert(text);
                    }
            	});
            },
            // 获取图表的内容
	        getChartInfo() {
            	// 如果id不存在，说明是新建的图表
            	if(!this.id){
		            this.generateWord(`let option = {\n   \n}\n`);
		            this.value = text;
		            this.addListenerToEditor()
                }else{
		            this.axios({
			            method: 'post',
			            url: window.apiURL + 'getChartInfo',
			            data: {
				            id: this.id
			            }
		            }).then(d => {
			            d = d.data.data;
                        this.chartName = d.name;
			            this.chartTags = this.removeNullValue(d.tag);
			            console.log(d);
			            this.generateWord(d.code);
			            this.value = editor.getValue();
			            this.addListenerToEditor()
		            })
                }
            },
            // 保存数据到服务器
	        triggerSave(params) {
            	this.rendered = false;
            	let costtime = new Date().getTime();
                this.axios({
                    method: 'post',
                    data:{...params,code:this.value,project: this.query.project,id:this.id},
                    url: window.apiURL + 'updateChart'
                }).then(d => {
                	console.log(d);
                	d = d.data.data;
                	if(d.status === 1){
                		this.message = `${new Date().toLocaleTimeString()}  已保存  ${new Date().getTime()-costtime}ms`;
                		let url = window.location.href;
                		window.sessionStorage.setItem(url,d.id);
                		if(!this.id){
                			this.id = d.id;
                        }
                    }else{
                		this.$Message.error(d.msg);
                        this.getChartInfo()
                    }
                });
            },
            // 运行代码查看效果
            runScripts() {
            	let chartoption;
            	let builder = this.value + `;\nchartoption = option;`;
            	try{
            		let echarts = this.$echarts,
                        Echarts = this.$echarts;
		            eval(builder);
		            if(chart){
			            this.$echarts.dispose(chart)
                    }
                    chart = this.$echarts.init(this.$refs.chart);
		            chart.on('finished',this.saveTempImg);
                    chart.setOption(chartoption);
                }catch (e) {
                    console.log(e);
	            }
            },
            // 保存缩略图
	        saveTempImg() {
		        if(chart){
		        	let img = chart.getDataURL();
		        	if(img!==tempimg&&!this.rendered){
				        tempimg = img;
				        this.updateImg();
                    }
		        }
            },
            // 上传缩略图
	        updateImg() {
		        let costtime = new Date().getTime();
            	if(chart){
		            let img = chart.getDataURL();
		            this.axios({
			            method: 'post',
			            url: window.apiURL + 'updateImg',
			            data: {
				            id: this.id,
				            img,
			            }
		            }).then(d => {
		            	this.rendered = true;
                        d = d.data.data;
                        if(d.status === 1){
                        	this.message = `${new Date().toLocaleTimeString()}  已更新缩略图  ${new Date().getTime()-costtime}ms`;
                        }
		            })
                }
            },
            // 切换代码和属性的开关
	        showProps(){
                this.isProps = !this.isProps;
            },
            // 添加标签
	        handleAdd() {
		        if (this.chartTags.length) {
			        this.chartTags.push(this.chartTags[this.chartTags.length - 1] + 1);
		        } else {
			        this.chartTags.push('图表');
		        }
	        },
            // 删除标签
	        handleClose2(event, name) {
		        const index = this.chartTags.indexOf(name);
		        this.chartTags.splice(index, 1);
	        },
            // 从dom读取数据
	        saveTagChange(key) {
		        this.chartTags[key] = this.$refs['tag' + key][0].textContent;
		        this.triggerSave({
			        name:this.chartName,
			        type:this.chartType,
			        tag:this.chartTags
		        },false)
            },
            // 删除数组中为空的元素
            removeNullValue(array){
            	if(this.$tool.isType('Array',array)){
                    return array.filter(val => val)
                }else{
            		return array
                }
            }
        },
        beforeRouteLeave(to,from,next){
			try {
				window.sessionStorage.removeItem(window.location.href);
                next()
			}catch (e) {
                next()
			}
        }
	}
</script>

<style scoped lang="scss">
.container{
    height: calc(100% - 60px);
    .js-editor{
        height: 100%;
        box-shadow: inset 0 1px 3px #161a1b;
        background-color: #2c3437;
        text-align: left;
        .header{
            height: 50px;
            background: rgba(255,255,255,.9);
            box-shadow: 0 1px 10px rgba(0,0,0,1);
            .floders{
                float: right;
                color: rgba(0,0,0,.7);
                line-height: 50px;
                padding: 0 15px;
                cursor: pointer;
                transition: all .4s;
                font-size: 16px;
                &:hover{
                    color: rgba(43, 174, 233,1);
                }
            }
            .runner{
                float: right;
                color: rgba(255,255,255,.7);
                background: rgba(43, 174, 233,1);
                line-height: 50px;
                padding: 0 25px;
                cursor: pointer;
                font-size: 16px;
                transition: all .4s;
            }
            .messages{
                height: 50px;
                line-height: 50px;
                display: inline-block;
                text-indent: 15px;
            }
            &:after{
                display: block;
                content: '';
                height: 0;
                width: 0;
                clear: both;
            }
        }
        .editor,.props{
            height: calc(100% - 50px);
            font-size: 18px;
        }
        .props{
            padding: 50px;
            .optionsline{
                display: flex;
                align-items: center;
                margin-top: 8px;
                .o-title{
                    color: #52D9EF;
                }
                input,label{
                    background: #2C3437;
                    border: none;
                    outline: none;
                    color: #fff0f6;
                }
                .tags{
                    flex: 1;
                    min-height: 60px;
                    border-radius: 2px;
                    padding: 5px;
                    display: flex;
                    align-items: baseline;
                    flex-wrap: wrap;
                    .tag-input{
                        background: #f7f7f7;
                        color: #000;
                        width: auto;
                        outline: none;
                    }
                }
            }
        }
    }
    .right-holder{
        height: 100%;
        padding: 50px;
        .charter{
            height: 100%;
        }
    }



}
</style>
