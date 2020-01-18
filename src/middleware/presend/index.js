import { istype } from '@/util';

function presend(req, res, next) {
	res.send = new Proxy(res.send, {
		apply :function (target, thisArg, argArray) {
			if(!thisArg.sended){
				thisArg.sended = true;
				argArray[0] = {
					data: argArray[0],
					...thisArg.predata
				};
				return Reflect.apply(target, thisArg, argArray)
			}
			return Reflect.apply(target, thisArg, argArray)
		}
	});
	res.presend = function(data){
		if(!res.predata){res.predata = {}}
		if(arguments.length === 1){
			if(istype('Object',data)){
				for(let i of Object.keys(data)){
					res.predata[i] = data[i];
				}
			}
		}else{
			if(istype('String',arguments[0])){
				res.predata[arguments[0]] = arguments[1];
			}
		}
	};
	next();
}

export default presend
