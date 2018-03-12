/**
 * Created by huang on 2017/7/15.
 */
//array.filter 兼容旧环境
if (!Array.prototype.filter) {
    Array.prototype.filter = function (fun /*, thisArg */) {
        "use strict";
        if (this === void 0 || this === null)
            throw new TypeError();
        var t = Object(this);
        var len = t.length >>> 0;
        if (typeof fun !== "function")
            throw new TypeError();
        var res = [];
        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
            if (i in t) {
                var val = t[i];
                // NOTE: Technically this should Object.defineProperty at
                //       the next index, as push can be affected by
                //       properties on Object.prototype and Array.prototype.
                //       But that method's new, and collisions should be
                //       rare, so use the more-compatible alternative.
                if (fun.call(thisArg, val, i, t))
                    res.push(val);
            }
        }
        return res;
    };
}
//解析地址栏(需更改地方太多，不提取到myFn)
function getRequest() {
    var url = decodeURIComponent(location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

/*——cookie———*/
var myCookie = {
    //设置cookie
    set: function (name, value) {
        document.cookie = name + "=" + escape(value) + "; path=/";
    },
    setWithTime: function (name, value, day) {
        var exp = new Date();
        exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    //读取cookie
    get: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
    //删除某一个cookie
    remove: function (name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.get(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + "; path=/";
    },
    //删除所有cookie
    clear: function () {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + "; path=/";
        }
    }
};
/*——公共方法———*/
var myFn = {
    /*****事件类******/
    //阻止冒泡
    stopBubble: function () {
        var e=arguments.callee.caller.arguments[0]||event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
        if (e && e.stopPropagation) {
            // this code is for Mozilla and Opera
            e.stopPropagation();
        } else if (window.event) {
            // this code is for IE
            window.event.cancelBubble = true;
        }
    },
    //获取接口请求随机码
    getUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    },
    //导航tab跳转
    urlTran: function (str, obj) {
        var index = str.lastIndexOf("\/");
        str = str.substring(index + 1, str.length);
        var strNew = str.split('.')[0];
        return obj[strNew]
    },
    //对象拷贝
    copy:function(obj){
        if(typeof obj != 'object'){
            return obj;
        }
        var newobj = {};
        for ( var attr in obj) {
            newobj[attr] = myFn.copy(obj[attr]);
        }
        return newobj;
    },

    /*****表单类******/
    //表单获取焦点清空提示信息
    inputFocus: function (target, msgbx) {
        target.focus(function () {
            msgbx.text('');
        });
    },
    //数据post到新窗口
    postBlank: function (action, data, target,method) {
        var form = $("<form/>").attr('action', action);
        if(method){
            form.attr('method', 'get');
        }else{
            form.attr('method', 'post');
        }
        if (target)
            form.attr('target', target);
        var input = '';
        $.each(data, function (i, n) {
            input += '<input type="hidden" name="' + i + '" value="' + n + '" />';
        });
        form.append(input).appendTo("body").css('display', 'none').submit();
        setTimeout(function(){
            form.remove();
        },2000);
    },
    //url解析参数变成对象
    urlToObj:function(url){
        var urlObject = {};
        if (/\?/.test(url)) {
            var urlString = url.substring(url.indexOf("?")+1);
            var urlArray = urlString.split("&");
            for (var i=0, len=urlArray.length; i<len; i++) {
                var urlItem = urlArray[i];
                var item = urlItem.split("=");
                urlObject[item[0]] = item[1];
            }
            return urlObject;
        }
    },

    /*****数字类******/
    //补位函数
    doubleNum: function (num) {
        var newNum;
        if (num < 10) {
            newNum = '0' + num;
        } else {
            newNum = num;
        }
        return newNum;
    },
    //两位小数  且不四舍五入
    twoDecimalAll: function (num) {
        var f_num = parseFloat(num);
        if (isNaN(f_num)) {
            return false
        }
        var new_num = f_num + "";
        var pos_decimal = new_num.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = new_num.length;
            new_num += '.';
        } else {
            new_num = new_num.substring(0, new_num.indexOf(".") + 3);
        }
        while (new_num.length <= pos_decimal + 2) {
            new_num += '0';
        }
        return new_num
    },
    //两位小数  且不四舍五入  整数不补位
    twoDecimal: function (num) {
        var f_num = parseFloat(num);
        if (isNaN(f_num)) {
            return false
        }
        var str = f_num + "";
        var str_decimal = str.indexOf('.');
        if (str_decimal > 0) {
            str = str.substring(0, str.indexOf(".") + 3);
        }
        return str
    },
    //金额格式化
    moneyEll:function(num){
        var newNum = num.toString();
        return newNum.split(',').join('');
    },

    /*****显示形式类******/
    //如果为null 则不显示
    strShow: function (str) {
        if (str) {
            return str;
        } else {
            return '';
        }
    },
    //姓名  显示姓+**
    nameEll: function (name) {
        var oName = name.toString();
        return oName.slice(0, 1) + new String('*', (oName.length - 1));
    },
    //银行卡号   中间用***替代
    bankEll: function (str) {
        var oStr = str.toString();
        return oStr.slice(0, 4) + '*******' + oStr.slice(-3);
    },
    //手机号码 QQ  中间用***替代
    mobileQQEll: function (str) {
        var oStr = str.toString();
        return oStr.slice(0, 3) + '****' + oStr.slice(-2);
    },
    //邮箱  中间用***替代
    emailEll: function (email) {
        var oEmail = email.toString();
        return oEmail.split('@')[0].slice(0, 2) + '****@' + oEmail.split('@')[1];
    },
    //时间格式转换 20170613-----2017/06/13是用于生日日期显示
    dateShow: function (birth) {
        var oDate = birth.toString();
        return oDate.slice(0, 4) + '/' + oDate.slice(4, 6) + '/' + oDate.slice(6, 8);
    },
    //日期2017-01-04 08:14:03    显示01/04（月 日）
    monthDayShow: function (dateTime) {
        var oDateTime = dateTime.toString();
        var arr1 = oDateTime.split(' ')[0];
        var arr1_2 = arr1.split('-');
        return arr1_2[1] + '/' + arr1_2[2];
    },

    /*****显示形式类(活动中用到)******/
    //用户名  中间用 * 代替
    userNameEll: function (str) {
        var oStr = str.toString();
        return oStr.slice(0, 2) + '****' + oStr.slice(-1);
    },
    //年月日 时分秒 ==》  月 日
    monthDayChange: function (str) {
        var newStr = str.split(' ')[1];
        return newStr
    },
    //年月日 时分秒 ==》  月 日 时分秒
    monthDayTimeShow: function (str) {
        var newStr = '';
        var str1 = str.split(' ')[0];
        var strArr = str1.split('-');
        newStr = strArr[1] + '/' + strArr[2] + ' ' + str.split(' ')[1];
        return newStr
    }
};
/*——表单正则验证———*/
var inputRegularObj = {
    username: {rule: /^[a-zA-Z0-9_]{4,12}$/, ruleMsg: '4-12位字母、数字组成的用户名'},
    password: {rule: /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/, ruleMsg: '6-20位（字母和数字）的密码'},
    passwordNum: {rule: /^[0-9]*$/, ruleMsg: ''},
    pay_password: {rule: /^[a-zA-Z0-9_]{6,20}$/, ruleMsg: '6-20位（字母、数字）的资金密码'},
    name: {rule: /^[\u4e00-\u9fa5 ]{2,20}$/, ruleMsg: '中文姓名'},
    nameEn: {rule: /^[a-zA-Z\/ ]{2,20}$/, ruleMsg: '英文姓名'},
    mobile: {rule: /^1[3|4|5|6|7|8|9][0-9]\d{8,8}$/, ruleMsg: '符合规范的手机号码'},
    email: {rule: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, ruleMsg: '符合规范的邮箱'},
    qq: {rule: /^[1-9][0-9]{4,14}$/, ruleMsg: '符合规范的QQ号码'},
    phone: {rule: /^[0-9]*$/, ruleMsg: '符合规范的电话号码'}
};

//加载层
var loaderBox = '<div id="loader-box"><div class="loader-shade"></div><div class="loader"></div></div>';
$('body').append(loaderBox);
//遮罩层
var shadeBox = '<div id="shade"></div>';
$('body').append(shadeBox);

/*——弹出层——*/
var myLayer = {
    //layer弹出层点击enter键 如果存在表单 会一直弹出 解决办法
    enterDelete: function () {
        document.onkeydown = function () {
            if (window.event && window.event.keyCode == 13) {
                window.event.returnValue = false;
            }
        }
    },
    //提示信息
    alertMsg0: function (message, closeFn) {
        layer.confirm(message, {
            skin: 'layer-skin1',
            icon: 0,
            title: '提示',
            area: '300px',
            shadeClose: true,
            btn: '确认', //按钮
            end: closeFn,
            success: function () {
                myLayer.enterDelete();
            }
        });
    },
    alertMsg5: function (message, closeFn) {
        layer.confirm(message, {
            skin: 'layer-skin1',
            icon: 5,
            title: '提示',
            area: '300px',
            shadeClose: true,
            btn: '确认', //按钮
            end: closeFn
        });
    },
    alertMsg0_w360: function (message, closeFn) {
        layer.confirm(message, {
            skin: 'layer-skin1',
            icon: 0,
            title: '提示',
            area: '360px',
            shadeClose: true,
            btn: '确认', //按钮
            end: closeFn
        });
    },
    //引导提示信息-提示登录
    promptBox: function (message, btn, sureFn, cancelFn) {
        layer.confirm(message, {
            skin: 'layer-skin1',
            icon: 0,
            title: '提示',
            btn: btn, //按钮
            area: '300px',
            cancel: cancelFn
        }, sureFn);
    },
    //询问框
    askBox: function (msg, btn1, btn2, btn1Fn, endFn) {
        layer.confirm(msg, {
            skin: 'layer-skin1',
            icon: 0,
            title: '提示',
            area: '300px',
            btn: [btn1, btn2], //按钮
            end: endFn
        }, btn1Fn)
    },
    //打开页面
    openContent: function (title, content, closeFn) {
        layer.open({
            skin: 'layer-demo1',
            type: 1,
            title: title,//标题
            area: '624px', //宽高
            content: content, //内容
            cancel: closeFn
        });
    },
    //打开页面  宽度自定义
    openContentList: function (area, title, content, closeFn) {
        layer.open({
            skin: 'layer-demo1',
            type: 1,
            title: title,//标题
            area: area, //宽高
            content: content, //内容
            cancel: closeFn
        });
    },
    //打开页面  高度无法确定，从上面弹出
    openContentTop: function (area, title, content, closeFn) {
        layer.open({
            skin: 'layer-demo1',
            type: 1,
            offset: '200px',
            area: area, //宽高
            title: title,//标题
            content: content, //内容
            cancel: closeFn
        });
    },
    //打开页面（含有成功回调）
    openContentSucc: function (title, content, sucFn) {
        layer.open({
            skin: 'layer-demo1',
            type: 1,
            title: title,//标题
            area: '624px', //宽高
            content: content, //内容
            success: sucFn
        });
    },
    //右下角提示窗口
    openContentRB: function (title,content) {
        layer.open({
            skin: 'layer-demo1',
            type: 1,
            shade:0,
            title:title,//标题
            area: ['340px', '215px'],
            offset: 'rb', //右下角弹出
            time: 30000, //30秒后自动关闭
            content: content //内容
        });
    },
    //输入口令层
    promptInput: function (title, sureFn) {
        layer.prompt({
            title: title,
            formType: 1
        }, sureFn);
    },
    //tips层
    tipsShow: function (msg, target) {
        layer.tips(msg, target, {
            time: 1000,
            tips: [2, '#6cb873']
        });
    },
    //更新成功或者失败提示
    msgPrompt: function (msg, endFn) {
        layer.msg(msg, {
            skin: 'prompt-msg',
            time: 1000,
            end: endFn
        });
    }
};

/*——数据请求与提交——*/
// 显示遮罩  $('#loader-box').show();
var postInfo = {}, loginInfo = {}, regInfo = {};
//socket
var mySocket = {
    timeOut:60000,
    timeOutObj:null,
    ws: null,
    lockReconnect:false,//避免重复连接
    connect: function () {
        if(pangu.webName=='八方会'){
            this.ws = new WebSocket('wss://' + pangu.myParam.site.socket);
        }else{
            this.ws = new WebSocket('ws://' + pangu.myParam.site.socket);
        }
        this.ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            if (mySocket.timeOutObj)clearTimeout(mySocket.timeOutObj);
            console.log('已连接...');
        };
        this.ws.onmessage = function (e) {
            mySocket.ws.send(JSON.stringify({type:"pong"}));
            var data = JSON.parse(e.data);
            if (!data.type) return;
            switch (data.type) {
                //type=bind。判断是否登录，没有登录请求绑定游客接口；已经登录，请求绑定会员接口。
                case 'bind':
                    if(myCookie.get('pgToken')){
                         apiRequest.bindUser({client_id: data.client_id});
                    }else{
                         apiRequest.bindGuest({client_id: data.client_id});
                     }
                    break;
                //接受消息
                case 'new_message':
                    myLayer.openContentRB(data.title,'<div class="window-info">'+data.content+'</div>');
                    //显示未读信息个数
                    apiRequest.newsUnreadNum(function(count){
                        if (count > 0) {
                            $('.left-side-news').append('<div class="new-dot">' + count + '</div>');

                            $('#open-myInfo .tab-item-ico').html('<i class="icon-message2"></i><div class="new-message"></div>');
                        } else {
                            $('.left-side-news').html('<i class="icon-message"></i> <span>消息中心 </span>');
                        }
                    });
                    break;
                //刷新余额
                case 'refresh_balance':
                    apiRequest.refreshBalance();
                    break;
                //在线支付成功
                case 'pay_success':
                    if(data.nonce==sessionStorage.getItem('nonce')){
                        //刷新余额
                        apiRequest.refreshBalance();
                        //收到回调 改变弹出框里面的内容
                        $('body .online-pay-alert .layui-layer-content').html('<i class="layui-layer-ico layui-layer-ico1"></i> 充值成功！');
                    }
                    break;
                // 同一账号同时登录被踢下线
                case 'offline':
                    apiRequest.userLogout(function(){
                        myLayer.alertMsg0_w360('您的账号已在其它设备上登录，当前设备已下线，如非本人登录，请及时修改密码，以免他人盗用',function(){
                            if(window.location.href.indexOf('user/') != -1){
                                window.location.href = '../index.html';
                            }else{
                                indexCom.loginStatus();
                                //首页刷新弹框状态
                                if(indexAd.noticeAd){
                                    indexAd.noticeAd();
                                }
                            }
                        });
                    });
                    break;
                // 后台强制下线
                case 'force_offline':
                    apiRequest.userLogout(function(){
                        myLayer.alertMsg0_w360('由于某种原因，您的账号被系统登出，如有疑问，请联系客服',function(){
                            if(window.location.href.indexOf('user/') != -1){
                                window.location.href = '../index.html';
                            }else{
                                indexCom.loginStatus();
                                //首页刷新弹框状态
                                if(indexAd.noticeAd){
                                    indexAd.noticeAd();
                                }
                            }
                        });
                    });
                    break;
                // 退出
                case 'logout':
                    break;
                // 刷新用户绑定
                case 'refresh_bind':
                    mySocket.changeConnect();
                    break;
                default:
            }
        };
        this.ws.onclose = function () {
            console.log('已断开...');
            mySocket.reconnect();
        };
        this.ws.onerror = function () {
            console.log('WebSocket错误');
        };
    },
    reconnect: function () {
        if(this.lockReconnect) return;
        this.lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        setTimeout(function () {
            mySocket.connect();
            mySocket.lockReconnect = false;
        }, 2000);
    },
    changeConnect:function(){
        if (this.ws)this.ws.close();
    }
};
//数据请求函数
var apiAjax = {
    //首页 个人中心
    set: function (opt) {
        if (opt.loader == 1) {
            $('#loader-box').show();
        }
        return {
            url: pangu.config.apiHost + opt.url + '?nonce=' + myFn.getUUID() + (opt.getParams || ''),
            type: opt.type || 'GET',
            data: opt.data || {},
            dataType: 'json',
            timeout: 30000,
            async:opt.async?false:true,
            success: function (res) {
                if (opt.loader == 1) {
                    $('#loader-box').hide();
                }
                if (res.code == 777) {
                    //网站关闭 调到维护页面
                    localStorage.closeReason = res.message;
                    window.location.href = 'http://' + window.location.host + '/prompt/wait.html';
                    return;
                } else if (res.code == 666) {
                    //token失效 跳到首页,重新登录
                    myCookie.clear();
                    sessionStorage.clear();
                    //退出登录接口不提示，直接退出   其他接口要提示
                    if (opt.url.indexOf('logout') != -1) {
                        window.location.href = 'http://' + window.location.host;
                    } else {
                        myLayer.alertMsg0('您长时间未操作，为了保障资金安全，请重新登录！', function () {
                            window.location.href = 'http://' + window.location.host;
                        });
                    }
                    return;
                } else {
                    opt.success(res);
                }
            },
            error: function (error) {
                console.log(error);
                if (opt.loader == 1) {
                    $('#loader-box').hide();
                }

                if(error.status<=0){
                    myLayer.msgPrompt("网络不给力，请重试！");
                } else if(error.status==401){
                    myLayer.msgPrompt("您没有授权，不可以访问哦！");
                }else if(error.status==403){
                    myLayer.msgPrompt("请求不可以访问！");
                }else if(error.status==404){
                    myLayer.msgPrompt("您访问了不存在的页面！");
                }else if(error.status==500){
                    myLayer.msgPrompt("服务器忙，请稍后再试！");
                }else if(error.status==504){
                    myLayer.msgPrompt("系统超时，请稍后再试！");
                }else{
                    if (opt.error) {
                        opt.error();
                    } else {
                        myLayer.msgPrompt("系统忙，请稍后再试！");
                    }
                }
            }
        };
    },
    //get请求参数解析
    getParamsDeter: function (data) {
        var str = '';
        for (var i in data) {
            str += '&' + i + '=' + data[i];
        }
        return str
    }
};
//各个接口请求
var apiRequest = {
    /*****全局*****/
    //获取站点配置
    getSite: function (sucFn) {
        $.ajax(apiAjax.set({
            url:  'setting-site',
            success: function (res) {
                if (res.status == 1) {
                    pangu.myParam.site = res.data;
                    //网站关闭
                    if (res.data.close == 1) {
                        //网站关闭 调到维护页面
                        localStorage.closeReason = res.message;
                        window.location.href = 'http://' + window.location.host + '/prompt/wait.html';
                        return;
                    }else {
                        //获取数据成功执行函数
                        sucFn();
                        //socket
                        mySocket.connect();
                    }
                }
            }
        }))
    },
    //获取用户信息
    getUserInfo: function (sucFn) {
        if (myCookie.get("myData")) {
            pangu.myData = JSON.parse(myCookie.get("myData"));
            $('.user-username-show').html(pangu.myData.username);
            $('.user-money-show').html(pangu.myData.balance);
            sucFn();
        } else {
            $.ajax(apiAjax.set({
                url:  'user-info',
                getParams: '&token=' + myCookie.get('pgToken'),
                success: function (res) {
                    if (res.status == 1) {
                        pangu.myData = res.data;
                        myCookie.set("myData", JSON.stringify(pangu.myData));
                        $('.user-username-show').html(pangu.myData.username);
                        $('.user-money-show').html(pangu.myData.balance);
                        sucFn();
                    }
                }
            }))
        }
    },
    //刷新用户信息
    refreshUserInfo: function (sucFn) {
        $.ajax(apiAjax.set({
            url:  'user-info',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    pangu.myData = res.data;
                    myCookie.set("myData", JSON.stringify(pangu.myData));
                    $('.user-username-show').html(pangu.myData.username);
                    $('.user-money-show').html(pangu.myData.balance);
                    sucFn();
                }
            }
        }))
    },
    //刷新余额
    refreshBalance: function (sucFn) {
        $.ajax(apiAjax.set({
            url:  'refresh-balance',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    pangu.myData.balance = res.data.balance;
                    pangu.myData.balance_frozen = res.data.balance_frozen;
                    pangu.myData.points = res.data.points;
                    myCookie.set("myData", JSON.stringify(pangu.myData));
                    $('.user-money-show').html(pangu.myData.balance);
                    $('.user-point-show').html(pangu.myData.points);
                }
            }
        }))
    },
    //获取密保问题列表
    safeQuestionList: function (sucFn) {
        if (myCookie.get("safe_question_list")) {
            pangu.myParam.safe_question_list = JSON.parse(myCookie.get("safe_question_list"));
            sucFn();
        } else {
            $.ajax(apiAjax.set({
                url:  'safe-question-list',
                success: function (res) {
                    if (res.status == 1) {
                        myCookie.set("safe_question_list", JSON.stringify(res.data));
                        pangu.myParam.safe_question_list = JSON.parse(myCookie.get("safe_question_list"));
                        sucFn();
                    }
                }
            }))
        }
    },
    //获取注册列表
    registerList: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'setting-register',
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }
            }
        }))
    },
    //用户注册
    userRegister: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'register',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //验证用户名是否存在-用于注册
    userCheckForReg: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'check-username-for-register',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //用户登录
    userLogin: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'login',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //用户退出登录
    userLogout: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'logout',
            type: 'POST',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    //cookie清除
                    myCookie.remove('myData');
                    myCookie.remove('pgToken');
                    myCookie.remove('indexLayerShow');
                    myCookie.remove('layerBefore');
                    myCookie.remove('layerAfter');
                    pangu.myData = {};
                    // myCookie.clear();
                    //session清除
                    //sessionStorage.clear();
                    sucFn();
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //绑定游客
    bindGuest: function (data) {
        $.ajax(apiAjax.set({
            url:  'bind-guest',
            type: 'POST',
            data: data,
            success: function (res) {

            }
        }))
    },
    //绑定用户
    bindUser: function (data) {
        $.ajax(apiAjax.set({
            url:  'bind-user',
            type: 'POST',
            data: data,
            getParams: '&token=' + myCookie.get('pgToken') + '&time=' + Math.random(),
            success: function (res) {

            }
        }))
    },

    /*****忘记密码*****/
    //验证用户名是否存在-用于忘记密码
    userCheckForPass: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'check-username-for-password',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //校验资金密码
    checkPayPassword: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'check-pay-password',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //校验密保问题
    checkSafeQuestion: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'check-safe-question',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //重置登录密码
    passwordReset: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'reset-password',
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },

    /*****账户信息*****/
    //绑定手机号
    userMobileBind: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bind-mobile',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //邮箱设置
    userEmailBind: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bind-email',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //实名认证
    userNameTest: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bind-basic-info',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //资金密码设置
    userPaySet: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bind-pay-password',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //资金密码修改
    userPayEdit: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'change-pay-password',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //修改登录密码
    userPassEdit: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'change-login-password',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //绑定QQ号码
    userQQBind: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bind-qq',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //密保问题
    userSafeQuestion: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bind-safe-answer',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //收货地址列表
    userAddressLists: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'shipping-address-list',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }
            }
        }))
    },
    //添加收货地址
    userAddressAdd: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'add-shipping-address',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //修改收货地址
    userAddressEdit: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'update-shipping-address',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //设为默认收货地址
    userAddressDefault: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'set-default-shipping-address',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //删除收货地址
    userAddressDel: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'delete-shipping-address',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },

    /*****游戏*****/
    //获取游戏列表
    gameListDataHandle:function(){
        pangu.myParam.game1=[]
        pangu.myParam.game2=[];
        pangu.myParam.game3=[];
        pangu.myParam.game4=[];
        for(var i in pangu.myParam.allGame){
            //体育
            if(pangu.myParam.allGame[i].type==1){
                pangu.myParam.game1.push(pangu.myParam.allGame[i]);
            }
            //彩票
            if(pangu.myParam.allGame[i].type==2){
                pangu.myParam.game2.push(pangu.myParam.allGame[i]);
            }
            //真人
            if(pangu.myParam.allGame[i].type==3){
                pangu.myParam.game3.push(pangu.myParam.allGame[i]);
            }
            //电子
            if(pangu.myParam.allGame[i].type==4){
                pangu.myParam.game4.push(pangu.myParam.allGame[i]);
            }
        }
      /*  //体育
        pangu.myParam.game1 = pangu.myParam.allGame.filter(function (arr) {
            return arr.type === 1;
        });
        //彩票
        pangu.myParam.game2 = pangu.myParam.allGame.filter(function (arr) {
            return arr.type === 2;
        });
        //真人
        pangu.myParam.game3 = pangu.myParam.allGame.filter(function (arr) {
            return arr.type === 3;
        });
        //电子
        pangu.myParam.game4 = pangu.myParam.allGame.filter(function (arr) {
            return arr.type === 4;
        });*/
        //个人中心 额度转换列表  AG  BBIN  MG等只保留一个
        var allGameLists = myFn.copy(pangu.myParam.allGame);
        var memberGameListObj = {
            bbinList:[],
            agList:[],
            mgList:[],
            otherList:[]
        };
        for(var i in allGameLists){
            //bbin
            if(allGameLists[i].image_code.indexOf('bbin')!=-1){
                allGameLists[i].name = 'BBin';
                memberGameListObj.bbinList.push(allGameLists[i]);
            }
            //ag
            else if(allGameLists[i].image_code.indexOf('ag')!=-1){
                allGameLists[i].name = 'AG';
                memberGameListObj.agList.push(allGameLists[i]);
            }
            //mg
            else if(allGameLists[i].image_code.indexOf('mg')!=-1){
                allGameLists[i].name = 'MG';
                memberGameListObj.mgList.push(allGameLists[i]);
            }
            else{
                memberGameListObj.otherList.push(allGameLists[i]);
            }
        }
        var a = [];
        if(memberGameListObj.bbinList.length>0){
            a = a.concat(memberGameListObj.bbinList[0]);
        }
        if(memberGameListObj.agList.length>0){
            a = a.concat(memberGameListObj.agList[0]);
        }
        if(memberGameListObj.mgList.length>0){
            a = a.concat(memberGameListObj.mgList[0]);
        }
        a = a.concat(memberGameListObj.otherList);
        pangu.myParam.memberGameList = a;
    },
    gameList: function (sucFn) {
        if (sessionStorage.getItem("game_list")) {
            pangu.myParam.allGame = JSON.parse(sessionStorage.getItem("game_list"));
            apiRequest.gameListDataHandle();
            sucFn();
        } else {
            $.ajax(apiAjax.set({
                url:  'game-list',
                success: function (res) {
                    if (res.status == 1) {
                        sessionStorage.setItem("game_list", JSON.stringify(res.data));
                        pangu.myParam.allGame = JSON.parse(sessionStorage.getItem("game_list"));
                        apiRequest.gameListDataHandle();
                        sucFn();
                    }
                }
            }))
        }
    },
    //获取游戏余额
    gameBalance: function (id, sucFn, noSucFn, thisLoader) {
        //局部加载层
        if (thisLoader) {
            thisLoader.show();
        }
        $.ajax(apiAjax.set({
            url:  'refresh-game-balance',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: {game_id: id, mobile: 0},
            success: function (res) {
                if (thisLoader)thisLoader.hide();
                if (res.status == 1) {
                    sucFn(res.data.balance);
                } else {
                   noSucFn(res);
                }
            }
        }));
        setTimeout(function () {
            if (thisLoader)thisLoader.hide();
        }, 15000)
    },
    //游戏转账
    gameTransfer: function (data, sucFn, noSucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'transfer-game-balance',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                    if (noSucFn) {
                        noSucFn();
                    }
                }
            }
        }))
    },
    gameTransferAsync: function (data, sucFn, noSucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'transfer-game-balance',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            async:1,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                    if (noSucFn) {
                        noSucFn();
                    }
                }
            }
        }))
    },
    //获取游戏跳转地址
    gameUrlIn: function (data, sucFn, errFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'redirect-to-game',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            async:1,
            success: function (res) {
                sucFn(res);
            },
            error: function () {
                if (errFn)errFn();
            }
        }))
    },
    //一键刷新余额
    gameAllBalance:function(sucFn){
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'refresh-all-game-balance',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }else{
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //一键回收
    gameAllBack:function(sucFn){
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'transfer-out-all-balance',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }else{
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //电子游戏列表
    gameCasinoLists: function (cName, sucFn) {
        $('#loader-box').show();
        $.getJSON('../../pub/json/' + cName + '.json', function (data) {
            $('#loader-box').hide();
            if (sucFn)sucFn(data);
        });
    },
    //幸运彩票游戏列表
    gameLotteryLists: function (sucFn) {
        $('#loader-box').show();
        $.getJSON('../../pub/json/lottery.json', function (data) {
            $('#loader-box').hide();
            if (sucFn)sucFn(data);
        });
    },
    //热门电子游戏推荐（不分平台）
    'gameCasinoHot': function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'get-electronic-list-hot',
            type: 'POST',
            data: {'hot': 1},
            success: function (res) {
                sucFn(res);
            }
        }))
    },

    //游戏报表
    gameReport: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'game-report',
            getParams: '&token=' + myCookie.get('pgToken') + apiAjax.getParamsDeter(data),
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }
            }
        }))
    },

    /*****消息 公告*****/
    //获取未读消息个数
    newsUnreadNum:function(sucFn){
        $.ajax(apiAjax.set({
            url:  'unread-message',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res.data.count);
                }
            }
        }))
    },
    //首页滚动公告
    noticeScroll: function (sucFn) {
        $.ajax(apiAjax.set({
            url:  'notice-list',
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }
            }
        }))
    },
    //首页弹出公告
    noticeAd: function (sucFn) {
        if (sessionStorage.getItem("adData")) {
            var adData = JSON.parse(sessionStorage.getItem("adData"));
            sucFn(adData);
        } else {
            $.ajax(apiAjax.set({
                url:  'ad-list',
                success: function (res) {
                    if (res.status == 1) {
                        //type：类型。1=首页图片弹窗；2=首页悬浮图片
                        //before_login：是否登录前。1=登录前；0=登录后
                        var adData = res.data;
                        var adDataObj = {};
                        //首页弹窗图片 登录前
                        adDataObj.layerBefore = adData.filter(function (arr) {
                            return arr.type == 1 && arr.before_login == 1 && arr.position == 1;
                        });
                        //首页悬浮图片 登录前
                        adDataObj.suspendBefore = adData.filter(function (arr) {
                            return arr.type == 2 && arr.before_login == 1 && arr.position == 1;
                        });
                        //首页弹窗图片 登录后
                        adDataObj.layerAfter = adData.filter(function (arr) {
                            return arr.type == 1 && arr.before_login == 0 && arr.position == 1;
                        });
                        //首页弹窗图片 登录后
                        adDataObj.suspendAfter = adData.filter(function (arr) {
                            return arr.type == 2 && arr.before_login == 0 && arr.position == 1;
                        });
                        //轮播图
                        adDataObj.banner = adData.filter(function (arr) {
                            return arr.type == 3 && arr.position == 1;
                        });
                        sessionStorage.setItem("adData", JSON.stringify(adDataObj));
                        sucFn(adDataObj);
                    }
                }
            }))
        }
    },
    //新手引导
    noviceBoot: function (sucFn) {
        $.ajax(apiAjax.set({
            url:  'close-beginner-guide',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if(res.status==1){
                    pangu.myData.show_beginner_guide = 0;
                    myCookie.set("myData", JSON.stringify(pangu.myData));
                }
            }
        }))
    },
    //消息列表
    newsLists: function (data, sucFn) {
        $.ajax(apiAjax.set({
            url:  'message-list',
            getParams: '&token=' + myCookie.get('pgToken') + apiAjax.getParamsDeter(data),
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //消息详情
    newsRead: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'read-message',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },

    /*****资金管理*****/
    /*
     充值:个人中心的token取cookie ；game.js的token取url
     */
    //在线支付列表
    rechargeOnlineLists: function (rechargeToken, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'payment-list',
            getParams: '&token=' + rechargeToken + '&mobile=' + 0,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //转账汇款列表
    rechargeTransferLists: function (rechargeToken, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'transfer-list',
            getParams: '&token=' + rechargeToken + '&mobile=' + 0,
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //转账汇款
    rechargeTransfer: function (rechargeToken, data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'transfer-order',
            getParams: '&token=' + rechargeToken,
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //在线支付查询
    rechargeOnlineQuery: function (rechargeToken, data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'query-order',
            getParams: '&token=' + rechargeToken,
            type: 'POST',
            data: data,
            success: function (res) {
                sucFn(res);
            }
        }))
    },

    /*提现*/
    //获取提现列表
    withDrawBankLists: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'bank-list',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }
            }
        }))
    },
    //添加银行卡
    withDrawBankAdd: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'add-bank',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //设为默认银行卡
    withDrawBankDefault: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'set-default-bank',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //删除银行卡
    withDrawBankDel: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'delete-bank',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //提现申请
    withDrawApply: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'withdraw',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            data: data,
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    /*账户明细*/
    accountLists: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'balance-log',
            getParams: '&token=' + myCookie.get('pgToken') + apiAjax.getParamsDeter(data),
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                }
            }
        }))
    },

    /*****会员等级*****/
    //会员等级列表
    memClassLists: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'grade-list',
            getParams: '&token=' + myCookie.get('pgToken'),
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //会员升级
    memClassUp: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'upgrade-grade',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            success: function (res) {
                if (res.status == 1) {
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },

    /*****活动 红利*****/
    //积分查询
    hlPointLog: function (data, sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'points-logs',
            getParams: '&token=' + myCookie.get('pgToken') + apiAjax.getParamsDeter(data),
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //生日礼金申请
    hlBirthdayApply: function (sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'apply-birthday-bonus',
            getParams: '&token=' + myCookie.get('pgToken'),
            type: 'POST',
            success: function (res) {
                if (res.status == 1) {
                    pangu.myData.apply_birthday_bonus = 0;
                    myCookie.set("myData", JSON.stringify(pangu.myData));
                    sucFn(res);
                } else {
                    myLayer.alertMsg0(res.message);
                }
            }
        }))
    },
    //优惠活动列表
    actLists: function (sucFn) {
        $.ajax(apiAjax.set({
            url:  'activities',
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    //优惠活动详情
    actDetails: function (data,sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'activity-details',
            getParams: apiAjax.getParamsDeter(data),
            success: function (res) {
                sucFn(res);
            }
        }))
    },
    actDetailsHtml: function (data,sucFn) {
        $.ajax(apiAjax.set({
            loader: 1,
            url:  'activity-details-html',
            getParams: apiAjax.getParamsDeter(data),
            success: function (res) {
                sucFn(res);
            }
        }))
    }
};
//维护页面接口请求
function getSiteWait(){
    $.ajax({
        url: pangu.config.apiHost + 'setting-site' + '?nonce=' + myFn.getUUID(),
        type: 'GET',
        dataType: 'json',
        timeout: 30000,
        success: function (res) {
            if (res.status == 1) {
                pangu.myParam.site = res.data;
                //联系客服
                $('.online-service').click(function(){
                    window.open(pangu.myParam.site.service_url);
                });
                //网站关闭
                if (pangu.myParam.site && pangu.myParam.site.close == 1){
                    $('.service-box .service-text').html(pangu.myParam.site.close_reason);
                }else{
                    window.location.href = 'http://' + window.location.host;
                }
            }
        },
        error: function (error) {
            console.log(error);
            if(error.status<=0){
                myLayer.msgPrompt("网络不给力，请重试！");
            } else if(error.status==401){
                myLayer.msgPrompt("您没有授权，不可以访问哦！");
            }else if(error.status==403){
                myLayer.msgPrompt("请求不可以访问！");
            }else if(error.status==404){
                myLayer.msgPrompt("您访问了不存在的页面！");
            }else if(error.status==500){
                myLayer.msgPrompt("服务器忙，请稍后再试！");
            }else if(error.status==504){
                myLayer.msgPrompt("系统超时，请稍后再试！");
            }else{
                myLayer.msgPrompt("系统忙，请稍后再试！");
            }
        }
    })
}