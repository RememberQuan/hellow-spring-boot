/**
 * parse simple map :{key:value}
 * @key  support custom value  && mongo operation  (keyword match:$in $or $and)
 * @value support basic type value like string,number or boolean and if @key is mongo operation
 *        and  structure that about:{"$in":{'user':[1,2,3,4,5]}},value will preset with Parser
 * @param param
 */
Vue.prototype.$getSolrQueryCondition = function (param) {
    var $this = this;
    if ($this.$isEmpty(param) || Object.keys(param).length <= 0) {
        return "*:*";
    }
    var hasValCondition = [];
    for (var key in param) {
        var value = param[key];
        if (!$this.$isEmpty(value)) {
            if ($.inArray(key, $this.supportOperation) != -1) {
                hasValCondition.push($this.$parseOperationCondition(key, value));
            } else {
                hasValCondition.push(key + ":" + value);
            }
        }
    }
    var cstr = hasValCondition.toString().replace(/,/g, " AND ");
    return $this.$isEmpty(cstr) ? "*:*" : "(" + cstr + ")";
}

/**
 * solr语法解析器当下支持的mongo特殊操作指令
 * @type {string[]}
 */
Vue.prototype.supportOperation = ["$in", "$or", "$and", "$lte", "$lt", "$gt", "$gte"];
/**
 * mongo操作查询解析器调用
 * @param operation
 * @param value
 * @returns {*}
 */
Vue.prototype.$parseOperationCondition = function (operation, value) {
    if (!$.inArray(operation, this.supportOperation) == -1) {
        throw "un-support query operation :" + operation;
    } else {
        return this.$solrQueryConditionObjectParser[operation == "$or" ? "$in" : operation](value);
    }

}
/**
 * solr  查询条件解析器
 * @type {{$in: Vue.$solrQueryConditionObjectParser.$in, $and: Vue.$solrQueryConditionObjectParser.$and, $lt: Vue.$solrQueryConditionObjectParser.$lt, $gt: Vue.$solrQueryConditionObjectParser.$gt, parseWithOperation: Vue.$solrQueryConditionObjectParser.parseWithOperation}}
 */
Vue.prototype.$solrQueryConditionObjectParser = {
    "$or": function (condition) {
        var $this = this;
        return $this["$in"](condition);
    },
    "$in": function (condition) {
        var $this = this;
        return $this.parseWithOperation("OR", condition);
    },
    "$and": function (condition) {
        var $this = this;
        return $this.parseWithOperation("AND", condition);
    },
    "$lte": function (condition) {
        if (condition.constructor != Object) {
            throw "error field structure";
        }
        var rs = [];
        for (var field in condition) {
            var value = condition[field];
            if (value.constructor != Number && value.constructor != String) {
                throw "error filed structure";
            } else {
                rs.push("[* TO " + value + "]");
            }
        }
        var rstr = " AND " + field + ":";
        var cstr = rs.toString().replace(/,/g, rstr);
        return "(" + field + ":" + cstr + ")";
    },
    "$gte": function (condition) {
        if (condition.constructor != Object) {
            throw "error field structure";
        }
        var rs = [];
        for (var field in condition) {
            var value = condition[field];
            if (value.constructor != Number && value.constructor != String) {
                throw "error filed structure";
            } else {
                rs.push("[" + value + " TO *]");
            }
        }
        var rstr = " AND " + field + ":";
        var cstr = rs.toString().replace(/,/g, rstr);
        return "(" + field + ":" + cstr + ")";
    },
    "$lt": function (condition) {
        if (condition.constructor != Object) {
            throw "error field structure";
        }
        var rs = [];
        for (var field in condition) {
            var value = condition[field];
            if (value.constructor != Number && value.constructor != String) {
                throw "error filed structure";
            } else {
                rs.push("{* TO " + value + "}");
            }
        }
        var rstr = " AND " + field + ":";
        var cstr = rs.toString().replace(/,/g, rstr);
        return "(" + field + ":" + cstr + ")";
    },
    "$gt": function (condition) {
        if (condition.constructor != Object) {
            throw "error field structure";
        }
        var rs = [];
        for (var field in condition) {
            var value = condition[field];
            if (value.constructor != Number && value.constructor != String) {
                throw "error filed structure";
            } else {
                rs.push("{" + value + " TO *}");
            }
        }
        var rstr = " AND " + field + ":";
        var cstr = rs.toString().replace(/,/g, rstr);
        return "(" + field + ":" + cstr + ")";
    },
    parseWithOperation: function (subStr, condition) {
        var rs = "";
        if (condition.constructor == Object) {
            var conditionAfterParse = [];
            for (var field in condition) {
                var value = condition[field];
                var rsItem = "";
                if ($.inArray(field, Vue.prototype.supportOperation) != -1) {
                    rsItem = Vue.prototype.$parseOperationCondition(field, value);
                } else if (value.constructor == Array) {

                    var rstr = " " + subStr + " " + field + ":";
                    var cstr = value.toString().replace(/,/g, rstr);
                    rsItem = "(" + field + ":" + cstr + ")";
                } else {
                    throw "error field structure";
                }
                conditionAfterParse.push(rsItem);
            }

            rs = conditionAfterParse.toString().replace(/,/g, " " + subStr + " ")
        } else {
            throw "error operation structure!";
        }
        return rs;
    }
}

Vue.prototype.$isEmpty = function (object) {
    if (object == null || typeof object == "undefined") {
        return true;
    } else if (object.constructor == Object) {
        for (var i = 0; i < Object.keys(object).length; i++) {
            var key = Object.keys(object)[i];
            if (object[key]) {
                return false;
            }
        }
        return true;
    } else if (object.constructor == Array) {
        for (var i = 0; i < object.length; i++) {
            if (object[i]) {
                return false;
            }
        }
        return true;
    } else {
        return (typeof object == 'undefined') || object == 'null' || object == "" || object == null;
    }
}

Vue.prototype.$NotEmptyField = function (object) {
    var notEmptyField = true;
    if (Vue.prototype.$isEmpty(object)) {
        return false;
    }
    $.each(object, function (idx, item) {
        if (Vue.prototype.$isEmpty(item)) {
            notEmptyField = false;
            return -1;
        }
    })
    return notEmptyField;
}

Vue.prototype.$getJson = function (uri, data, _cb, notAsync) {
    if (!data["userId"] && CURRENT_USER_ID) {
        data["userId"] = CURRENT_USER_ID;
    }
    $.ajax({
        url: uri,
        data: data,
        async: notAsync ? false : true,
        type: 'POST',
        success: function (res) {
            if (_cb && typeof _cb == 'function') {
                _cb(res.code, res.data || res.errMsg);
            }
        }
    })
}

Vue.prototype.$getJsonPooled = function (uri, data, _cb, notAsync) {
    $.pooledAjax({
        url: uri,
        data: data,
        async: notAsync ? false : true,
        type: 'POST',
        success: function (res) {
            if (_cb && typeof _cb == 'function') {
                _cb(res.code, res.data || res.errMsg);
            }
        }
    })
}

Vue.prototype.$postFormData = function (option) {
    var _cb = option.success ? option.success : null;
    // if (option.data && !option.data.userId) {
    //     option.data["userId"] = CurrentUser.userId;
    // }
    $.ajax({
        url: option.url,
        data: JSON.stringify(option.data || {}),
        contentType: 'application/json',
        dataType: 'json',
        async: (typeof option.async != "undefined") ? option.async : true,
        type: 'POST',
        success: function (res) {
            if (_cb && typeof _cb == 'function') {
                _cb(res.code, res.data || res.errMsg);
            }
        }
    })
}
Vue.prototype.$windowGet = function (ex) {
    var list = [];
    for(var i =1;i<arguments.length;i++){
        list.push(arguments[i]);
    }
    if(list.length>0) {
        return eval(ex).apply(null, list);
    }
    return eval(ex);
}


Vue.filter("dateFormat", function (d) {
    return new Date(d).format("yyyy-MM-dd");
})

Vue.filter("dateTimeFormat", function (d) {
    return new Date(d).format("yyyy-MM-dd HH:mm:ss");
})