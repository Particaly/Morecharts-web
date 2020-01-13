<template>
    <main class="container">
        <Split v-model="split">
            <div slot="left" class="js-editor" id="editor"></div>
            <div slot="right" class="split-pane"></div>
        </Split>
    </main>
</template>

<script>
    let editor,chart,savetimer;
	export default {
		name: "Editor",
        data: function(){
            return {
	            split: 0.43,
                type: '',
                value: '',
                id:''
            }
        },
        computed:{
			query: function() {
				return this.$route.query
            },
        },
        created() {
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
            	console.log(this.id);
            	if(this.query.chart === undefined && !this.id){
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
			            d = d.data;
			            console.log(d);
			            let text = `/*\n* @name: ${this.query.name}\n*/\n\n`;
			            this.generateWord(text);
			            this.value = editor.getValue();
			            this.addListenerToEditor()
		            })
                }
            },
	        triggerSave(params){
            	console.log(params);
                console.log('saved');
                this.axios({
                    method: 'post',
                    data:{...params,code:this.value},
                    url: window.apiURL + 'updateChart'
                }).then(d => {
                	d = d.data.data;
                	if(d.status === 1){
                		let url = window.location.href;
                		window.sessionStorage.setItem(url,d.id);
                    }else{
                		this.$Message.error(d.msg)
                    }
                	console.log(d);
                })
            }
        },
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
        font-size: 18px;
    }
}
</style>
