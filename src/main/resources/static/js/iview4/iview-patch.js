if(typeof Array.includes == 'undefined'){
    Array.prototype.includes = function(obj){
        return this.indexOf(obj) >=0
    }
}

if(typeof Array.findIndex == 'undefined'){
    Array.prototype.findIndex = function(obj){
        for(var i in this){
            if(this[i] == obj){
                return i;
            }
        }
        return -1
    }
}
if(typeof Array.find == 'undefined'){
    Array.prototype.find = function(fn){
        for(var i in this){
            if(fn(this[i],i,this)== true){
                return this[i];
            }
        }
        return undefined;
    }
}