<template>
    <main class="container">
        <Split v-model="split">
            <div slot="left" class="js-editor" >
                <div class="header">
                    <div class="messages">{{message}}</div>
                    <div class="runner" @click="runScripts">运行</div>
                    <div class="floders">属性</div>
                </div>
                <div class="editor" id="editor"></div>
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
	        }
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
            createScript(){
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
            onScriptReady(){
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
            addListenerToEditor(){
	            editor.session.on('change', (delta) => {
		            let value = editor.getValue(),
			            nameRules = new RegExp(/@name.*?:(.*)?\n/),
			            typeRules = new RegExp(/@type.*?:(.*)?\n/),
			            tagRules = new RegExp(/@tag.*?:(.*)?\n/),
			            name = value.match(nameRules),
			            type = value.match(typeRules),
			            tag = value.match(tagRules);
		            if(name.length&&name[1]){
			            name = name[1].trim();
		            }
		            if(type.length&&type[1]){
			            type = type[1].trim();
		            }
		            if(tag.length&&tag[1]){
			            tag = tag[1].trim();
			            let fh = new RegExp(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/ig);
			            tag = tag.replace(fh,',').split(',');
		            }
		            this.type = type;
		            if(this.value!==value){
			            if(savetimer){
				            clearTimeout(savetimer);
			            }
			            savetimer = setTimeout(() => {
				            this.value = value;
				            this.triggerSave({name,tag,type});
			            },1000)
                    }else{
			            if(savetimer){
				            clearTimeout(savetimer);
			            }
                    }
	            });
            },
            generateWord(text){
            	this.$nextTick(() => {
            		if(editor){
			            editor.insert(text);
                    }
            	});
            },
	        getChartInfo(){
            	if(!this.id){
            		let header = `/*\n* @name: ${this.query.name}\n`;
            		let type = `* @type: echarts\n`;
            		let tag = `* @tag: \n*/\n\n`;
            		let defaultOption = `let option = {\n   \n}\n`;
		            let text = header+type+tag+defaultOption;
		            this.generateWord(text);
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
			            this.generateWord(d.code);
			            this.value = editor.getValue();
			            this.addListenerToEditor()
		            })
                }
            },
	        triggerSave(params){
            	this.rendered = false;
            	let costtime = new Date().getTime();
		        this.runScripts();
                this.axios({
                    method: 'post',
                    data:{...params,code:this.value,project: this.query.project,id:this.id},
                    url: window.apiURL + 'updateChart'
                }).then(d => {
                	d = d.data.data;
                	if(d.status === 1){
                		this.message = `${new Date().toLocaleTimeString()}  已保存  ${new Date().getTime()-costtime}ms`;
                		let url = window.location.href;
                		window.sessionStorage.setItem(url,d.id);
                		if(!this.id){
                			this.id = d.id;
                        }
                    }else{
                		this.$Message.error(d.msg)
                    }
                });
            },
            runScripts(){
            	let chartoption;
            	let builder = this.value + `;\nchartoption = option;`;
            	try{
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
	        saveTempImg() {
		        if(chart){
		        	let img = chart.getDataURL();
		        	if(img!==tempimg&&!this.rendered){
				        tempimg = img;
				        this.updateImg();
                    }
		        }
            },
	        updateImg(){
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
        .editor{
            height: calc(100% - 50px);
            font-size: 18px;
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
