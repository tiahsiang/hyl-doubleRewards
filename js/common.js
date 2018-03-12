/**
 * Created by Administrator on 2016/12/20.
 */
//通过代理链接注册，获取代理标识
var Request = getRequest();
if (Request['a']) {
    localStorage.setItem('agent_salt', Request['a']);
}
/*—————————时间选择框—————————*/
function dateSelect() {
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //开始和结束两个选择框
        var start = {
            format: 'YYYY-MM-DD hh:mm:ss'
            , max: laydate.now()
            , istime: true
            , istoday: false
            , choose: function (datas) {
                end.min = datas; //开始日选好后，重置结束日的最小日期
                //end.start = datas; //将结束日的初始值设定为开始日
            }
        };
        var end = {
            format: 'YYYY-MM-DD hh:mm:ss'
            , max: laydate.now()
            , istime: true
            , istoday: false
            , choose: function (datas) {
                start.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        $('#datetimepickerFrom').click(function () {
            start.elem = this;
            laydate(start);
        });
        $('#datetimepickerTo').click(function () {
            end.elem = this;
            laydate(end);
        });
        //15天之内
        var start15 = {
            format: 'YYYY-MM-DD hh:mm:ss'
            , min: laydate.now(-15) //最小日期 15天之前
            , max: laydate.now()
            , istime: true
            , istoday: false
            , choose: function (datas) {
                end15.min = datas; //开始日选好后，重置结束日的最小日期
            }
        };
        var end15 = {
            format: 'YYYY-MM-DD hh:mm:ss'
            , max: laydate.now()
            , istime: true
            , istoday: false
            , choose: function (datas) {
                start15.max = datas; //结束日选好后，重置开始日的最大日期
            }
        };
        $('#datetimepickerFrom15').click(function () {
            start15.elem = this;
            laydate(start15);
        });
        $('#datetimepickerTo15').click(function () {
            end15.elem = this;
            laydate(end15);
        });
        //单个选择框
        var time = {
            format: 'YYYY-MM-DD hh:mm:ss'
            , istime: true
            , istoday: false
        };
        $('#datetimepicker').click(function () {
            time.elem = this;
            laydate(time);
        });

        //年月日选择框
        var dateTime = {
            format: 'YYYY-MM-DD'
            ,istime: false
            ,istoday: false
        };
        $('#datepicker').click(function () {
            dateTime.elem = this;
            laydate(dateTime);
        });
    });
}

/***********（真人  体育  电子  彩票） **********/
//登录 --->
function gameInBeforeFn() {
    $('.openfastTransfer').off();
    $('.openfastTransfer').on('click', function () {
        var gameId = $(this).attr('data-id');
        var key = $(this).attr('data-key');
        var title = $(this).attr('data-title');
        testLogin(function(){
            gameInBeforeTransfer(gameId,key,title,'','','');
        });
    })
}

//查询余额 ---> 打开额度转换框
function gameInBeforeTransfer(gameId,key,title,anchorId,roomId,online){
    //打开额度转换框(单向额度转换)
    var fastTransfer = $('.fast-modal-transfer');
    if (fastTransfer.length == 0) {
        var fastTransferBox = '<div class="fast-modal-transfer animated bounceInDown"></div>';
        $('body').append(fastTransferBox);
        fastTransfer = $('.fast-modal-transfer');
    }
    fastTransfer.load('../../pub/view/fast_modal_transfer.html', function (responseText, textStatus, XMLHttpRequest) {
        if (textStatus == 'success') {
            fastTransfer.html(responseText);
            fastTransfer.show(function () {
                $('#shade').show();
                //请求中心账户余额
                apiRequest.refreshBalance();
                //请求第三方余额
                $('.fast-modal-transfer .fast-transfer-r h3').text(title);
                apiRequest.gameBalance(gameId,function(balance){
                    $('.fast-modal-transfer .fast-transfer-r p').text(balance);
                },function(res){
                    myLayer.alertMsg0(res.message,function(){
                        //关闭模态转化框
                        fastTransfer.slideUp();
                        $('#shade').hide();
                    });
                });
                //模态框初始化
                var transferAccountVal = $("#transfer-account");
                var gameInit = $('.fast-modal-transfer .transefer-init');
                var gameEnter = $('.fast-modal-transfer .game-enter');
                var gameWait = $('.fast-modal-transfer .transfer-wait');
                gameInit.show();
                gameWait.hide();
                gameEnter.hide();
                transferAccountVal.val('');
                //关闭模态转化框
                $('.close-fastModalTransfer').click(function () {
                    fastTransfer.slideUp();
                    $('#shade').hide();
                });
                //直接进入游戏
                $('#enterGame').click(function () {
                    fastTransfer.slideUp();
                    $('#shade').hide();
                    //进入游戏
                    gameEnterFn(gameId,key,title,anchorId,roomId,online);
                });
                //转入金额并进入游戏
                gameInit.click(function(){
                    if(transferAccountVal.val() ==''){
                        myLayer.msgPrompt('请输入金额');
                        gameInit.show();
                        gameWait.hide();
                        gameEnter.hide();
                        return
                    }
                    if(parseFloat(transferAccountVal.val())<=0){
                        myLayer.msgPrompt('金额最小不低于1元');
                        transferAccountVal.val('');
                        gameInit.show();
                        gameWait.hide();
                        gameEnter.hide();
                        return
                    }
                    if(parseFloat(transferAccountVal.val()) > parseFloat(pangu.myData.balance)){
                        myLayer.msgPrompt('中心账户余额不足！');
                        gameInit.show();
                        gameWait.hide();
                        gameEnter.hide();
                        return
                    }
                    gameInit.hide();
                    gameWait.show();
                    gameEnter.hide();

                    var newWindow=window.open('about_blank');
                    newWindow.document.writeln("<!DOCTYPE html>");
                    newWindow.document.writeln("<style type=\"text/css\">");
                    newWindow.document.writeln("body{background-color:#000}.status{position: absolute;  width: 300px;  height: 280px;  left: 50%;  top: 50%;  margin-left: -150px;  margin-top: -140px;  z-index: 1;} .status-mg{width: 100%;} .status-mg img{display: block;width: 100%;} .spinner{width: 100px;  height: 60px;  text-align: center;  font-size: 10px;  margin-left: 88px;  margin-top: 10px;  }  .spinner > div {margin-right:3px;background-color: #c4b689;  height: 100%;  width: 10px;  display: inline-block;  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;  animation: stretchdelay 1.2s infinite ease-in-out;  } .spinner .rect2 { -webkit-animation-delay: -1.1s;  animation-delay: -1.1s;  }.spinner .rect3 {  -webkit-animation-delay: -1.0s;  animation-delay: -1.0s;  }.spinner .rect4 {  -webkit-animation-delay: -0.9s;  animation-delay: -0.9s;  }.spinner .rect5 {  -webkit-animation-delay: -0.8s;  animation-delay: -0.8s;  }@-webkit-keyframes stretchdelay { 0%, 40%, 100% { -webkit-transform: scaleY(0.4) } 20% { -webkit-transform: scaleY(1.0) } }@keyframes stretchdelay { 0%, 40%, 100% {  transform: scaleY(0.4);  -webkit-transform: scaleY(0.4);  } 20% {  transform: scaleY(1.0);  -webkit-transform: scaleY(1.0);  } }");
                    newWindow.document.writeln("</style>");
                    newWindow.document.writeln('<div class="status"><div class="status-mg"><img src="quote/images/logo/load-logo.png" alt="加载中..."></div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>');
                    apiRequest.gameTransfer({
                        'game_id':gameId,
                        'money':transferAccountVal.val(),
                        'type':0,
                        'mobile':0
                    },function(res){
                        gameInit.hide();
                        gameWait.hide();
                        gameEnter.show();
                        //进入游戏
                        gameEnterFn(gameId,key,title,anchorId,roomId,online,newWindow);
                        //刷新中心账户余额
                        apiRequest.refreshBalance();
                        fastTransfer.slideUp("normal",function(){
                            transferAccountVal.val('');
                            $('#shade').hide();
                        });
                    });
                })
            });
        }
    });
}


//进入游戏
function gameEnterFn(gameId,key,title,anchorId,roomId,online,newWindow){
    if(!newWindow){
        newWindow = window.open('_blank');
        newWindow.document.writeln("<!DOCTYPE html>");
        newWindow.document.writeln("<style type=\"text/css\">");
        newWindow.document.writeln("body{background-color:#000}.status{position: absolute;  width: 300px;  height: 280px;  left: 50%;  top: 50%;  margin-left: -150px;  margin-top: -140px;  z-index: 1;} .status-mg{width: 100%;} .status-mg img{display: block;width: 100%;} .spinner{width: 100px;  height: 60px;  text-align: center;  font-size: 10px;  margin-left: 88px;  margin-top: 10px;  }  .spinner > div {margin-right:3px;background-color: #c4b689;  height: 100%;  width: 10px;  display: inline-block;  -webkit-animation: stretchdelay 1.2s infinite ease-in-out;  animation: stretchdelay 1.2s infinite ease-in-out;  } .spinner .rect2 { -webkit-animation-delay: -1.1s;  animation-delay: -1.1s;  }.spinner .rect3 {  -webkit-animation-delay: -1.0s;  animation-delay: -1.0s;  }.spinner .rect4 {  -webkit-animation-delay: -0.9s;  animation-delay: -0.9s;  }.spinner .rect5 {  -webkit-animation-delay: -0.8s;  animation-delay: -0.8s;  }@-webkit-keyframes stretchdelay { 0%, 40%, 100% { -webkit-transform: scaleY(0.4) } 20% { -webkit-transform: scaleY(1.0) } }@keyframes stretchdelay { 0%, 40%, 100% {  transform: scaleY(0.4);  -webkit-transform: scaleY(0.4);  } 20% {  transform: scaleY(1.0);  -webkit-transform: scaleY(1.0);  } }");
        newWindow.document.writeln("</style>");
        newWindow.document.writeln('<div class="status"><div class="status-mg"><img src="quote/images/logo/load-logo.png" alt="加载中..."></div><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div>');
    }
    //不支持嵌套的(bbin  pt 幸运彩票 IM 全部是url)
    if(title.indexOf('BBIN')!=-1 || title.indexOf('BB体育')!=-1|| title.indexOf('PT')!=-1 || title.indexOf('彩播')!=-1){
        var postInfo = {
            'game_id': gameId,
            'mobile':0
        };
        if(key){
            postInfo.key = key;
        }
        apiRequest.gameUrlIn(postInfo, function (res) {
            if (res.status == 1) {
              /*  //表单提交
                if (res.data.type == 'form') {
                    myFn.postBlank(res.data.url,res.data.fields,'_blank');
                }*/
                //直接打开链接
                if (res.data.type == 'url') {
                    var gameUrl = res.data.url;
                    if(title.indexOf('彩播')!=-1){
                        if(online==1){
                            //主播在线
                            gameUrl = gameUrl+'&id='+roomId+'&anchorId='+anchorId;
                        }else{
                            //主播不在线
                            gameUrl = gameUrl.replace(/liveView/, "anchorHome")+'&id='+anchorId;
                        }
                    }
                    newWindow.location.href=gameUrl;
                }
            }else{
                myLayer.alertMsg0(res.message);
            }

        });
    }
    //嵌套iframe打开
    else{
        var iframeUrl='';
        //电子游戏有key值
        if(key){
            iframeUrl='game.html?id='+gameId+'&key='+key+'&title='+title+'&token='+myCookie.get('pgToken');
        } else{
            iframeUrl='game.html?id='+gameId+'&title='+title+'&token='+myCookie.get('pgToken');
        }
        newWindow.location.href = iframeUrl;
    }
}
/***********（真人  体育  电子  彩票）**********/

/***********彩播 **********/
function caiboIn(lotteryBox,gameId,key,title){
    //第一个参数 放主播列表的盒子
    // 第二个参数  点击主播跳转函数（主播id,房间id,是否在线  1-在线 跳到主播直播页  0-不在线 跳到主播空间页）
    //测试站用测试站链接
    if(window.location.host=='dev.testpangu.com'){
        caiboLinkTest(lotteryBox,function(anchorId,roomId,online){
            //先判断是否登陆
            testLogin(function(){
                gameInBeforeTransfer(gameId,key,title,anchorId,roomId,online);
            });
        });
    }else{
        caiboLink(lotteryBox,function(anchorId,roomId,online){
            //先判断是否登陆
            testLogin(function(){
                gameInBeforeTransfer(gameId,key,title,anchorId,roomId,online);
            });
        });
    }
}
/***********彩播 **********/

/*—————————登录相关—————————*/
var loginCom={
    //获取验证码
    getCode:function(){
        var codeTime = Date.parse(new Date());
        sessionStorage.setItem("login_code_time", codeTime);
        $('#login-client-code').html('<img src="'+pangu.config.apiHost+'captcha?time='+codeTime+'">');
    },
    //登录
    login:function(){
        var login1 = $("input[name^='login-username']"),
            login2 = $("input[name^='login-password']"),
            login3 = $("input[name^='login-textCode']"),
            loginErr = $('.login-modal .form-item-err');
        loginErr.text('');
        myFn.inputFocus(login1, loginErr);
        myFn.inputFocus(login2, loginErr);
        myFn.inputFocus(login3, loginErr);
        if (login1.val() == '') {
            loginErr.show(function () {
                loginErr.text('请输入用户名');
            });
            return
        }
        //用户名：4-12位数字或者字母组合
        if (!(inputRegularObj.username.rule).test(login1.val().replace(/(\s*$)/g, ""))) {
            loginErr.text('请输入' + inputRegularObj.username.ruleMsg);
            login1.val('');
            login2.val('');
            login3.val('');
            return
        }
        if (login2.val() == '') {
            loginErr.show(function () {
                loginErr.text('请输入密码');
            });
            return
        }
        //密码：6-20位数字和字母组合  bf会员接触密码限制
        if(pangu.webName=='八方会'){
            if ((inputRegularObj.passwordNum.rule).test(login2.val())) {
                myLayer.alertMsg0('您现在的密码为纯数字，请及时修改密码为6-20位（字母和数字)');
            }
        }else{
            if (!(inputRegularObj.password.rule).test(login2.val())) {
                loginErr.text('请输入' + inputRegularObj.password.ruleMsg);
                login2.val('');
                login3.val('');
                return
            }
        }

        login1.change(function () {
            $('.login-modal .form-item-textCode').hide();
        });
        var loginInfo = {
            'username': login1.val().replace(/(\s*$)/g, ""),
            'password': login2.val(),
            'login_url': window.location.href,
            'screen': window.screen.width + 'x' + window.screen.height
        };
        if ($('#login-code-input').css('display') == 'block') {
            if (login3.val() == '') {
                loginErr.show(function () {
                    loginErr.text('请输入验证码');
                });
                return
            }
            loginInfo.code = login3.val();
            loginInfo.time = sessionStorage.getItem("login_code_time");
        }
        apiRequest.userLogin(loginInfo, function (res) {
            myCookie.remove('pgToken');
            myCookie.remove('indexLayerShow');
            if (res.status == 1) {
                myCookie.set('pgToken', res.data.token);
                myCookie.set('indexLayerShow', 1);
                //清除验证码session
                sessionStorage.removeItem("login_code_time");
                //重新连接socket
                mySocket.changeConnect();
                myLayer.msgPrompt(res.message, function () {
                    login1.val('');
                    login2.val('');
                    login3.val('');
                    //有登陆弹出框
                    if($('#login-box').length>0){
                        $('#login-box').hide(100, function () {
                            //注册界面
                            if (window.location.href.indexOf('reg') != -1) {
                                window.location.href = 'index.html';
                            } else {
                                indexCom.loginStatus();
                                //首页刷新弹框状态
                                if(indexAd.noticeAd){
                                    indexAd.noticeAd();
                                }
                            }
                        });
                    }else{
                        //注册界面
                        if (window.location.href.indexOf('reg') != -1) {
                            window.location.href = 'index.html';
                        } else {
                            indexCom.loginStatus();
                            //首页刷新弹框状态
                            if(indexAd.noticeAd){
                                indexAd.noticeAd();
                            }
                        }
                    }
                });
            } else {
                //输错5次以上 请输入验证码
                if (res.data.fail_times >=5 ) {
                    $('#login-code-input').show();
                    loginCom.getCode();
                }
                if ($('#login-code-input').css('display') == 'block') {
                    login3.val('');
                    loginCom.getCode();
                }
                if(res.message=='用户名或密码错误'){
                    login2.val('');
                }
                loginErr.text(res.message);
            }
        });
    },
    //忘记密码获取验证码
    forgetGetCode:function(){
        var codeTime = Date.parse(new Date());
        sessionStorage.setItem("forget_code_time", codeTime);
        $('.find-modal-content2 .form-item-textCode .client-code').html('<img src="'+pangu.config.apiHost+'captcha?time='+codeTime+'">');
    },
    //忘记密码
    forgetPassword:function(){
        var safeQuestionVal = '';
        $('#forgot-password').click(function () {
            $('#login-box').hide();
            var findPassword = $('.findPassword');
            if (findPassword.length == 0) {
                var findPasswordBox = '<div class="findPassword"></div>';
                $('body').append(findPasswordBox);
                findPassword = $('.findPassword');
            }
            findPassword.load('../../pub/view/findPassword.html', function (responseText, textStatus, XMLHttpRequest) {
                if (textStatus == 'success') {
                    findPassword.html(responseText);
                    findPassword.show();
                    $('#shade').show();
                    //关闭忘记密码框
                    $('.close-findPassword').click(function () {
                        findPassword.css('display', 'none');
                        $('#shade').hide();
                    });
                    //客服
                    $('.findPassword .online-service').click(function () {
                        indexCom.custom();
                    });
                    //输入用户名后显示验证方式状态
                    function textTypeStatus(index) {
                        var targetLi = $('.security-issue ul li').eq(index);
                        targetLi.find('.security-ico-bg').addClass('security-ico-active');
                        targetLi.find('.hint').html('已绑定');
                    }

                    //第一步，验证用户名是否存在
                    $('#choose-textType').click(function () {
                        postInfo = {};
                        var nameTest = $('#userNameTest'),
                            userNameErr = $('.userNameTest-err');
                        userNameErr.text('');
                        myFn.inputFocus(nameTest, userNameErr);
                        if (nameTest.val() == '') {
                            userNameErr.text('请输入用户名');
                            return
                        }
                        //用户名：4-12位数字或者字母组合
                        if (!(inputRegularObj.username.rule).test(nameTest.val().replace(/(\s*$)/g, ""))) {
                            userNameErr.text('请输入'+inputRegularObj.username.ruleMsg);
                            nameTest.val('');
                            return
                        }
                        postInfo = {
                            'username': nameTest.val()
                        };
                        apiRequest.userCheckForPass(postInfo, function (res) {
                            var testStatusNum = 0;
                            if (res.status == 1) {
                                var userExistData = res.data;
                                var existedUserName = nameTest.val();
                                nameTest.val('');
                                $('#find-password1').hide();
                                if (userExistData.bind_safe_question == 1) {
                                    textTypeStatus(0);
                                    testStatusNum++;
                                }
                                if (userExistData.bind_pay_password==1) {
                                    textTypeStatus(1);
                                    testStatusNum++;
                                }
                                $('#find-password2').show();
                                if (testStatusNum == 0) {
                                    $('.find-modal-content1 .security-issue-no').show();
                                }
                                chooseTestType(existedUserName);
                            } else {
                                userNameErr.text(res.message);
                            }
                        });
                    });

                    //第二步，选择验证方式
                    function chooseTestType(userName) {
                        $('.security-issue .security-open .security-ico-active').click(function () {
                            var type = $(this).parents('li').find('.security-type').html();
                            $('.find-modal-content1').hide(60, function () {
                                $('.find-modal-content2').show();
                                $('.find-modal-setup ul li').eq(1).addClass('find-modal-setup-active').siblings('.find-modal-setup ul li').removeClass('find-modal-setup-active');
                                $('.find-modal-setup ul li').eq(0).find('.right-arrow1').css({
                                    'border-top': '18px #a72d31 solid',
                                    'border-bottom': '18px #a72d31 solid'
                                });
                                //验证码
                                var findTypeTextCodeDiv = $('.find-modal-content2 .form-item-textCode');
                                var findTypeTextCode =  $("input[name^='findType-textCode']");
                                //错误提示
                                var findErrMsg = $('.find-modal-content2 .findType-err');
                                if (type == '密保问题') {
                                    $('.find-modal-content2 .find-by-safeQuestion-item').show();
                                    //获取密保问题列表
                                    apiRequest.safeQuestionList(function () {
                                        var options = '';
                                        var optionLists = pangu.myParam.safe_question_list;
                                        optionLists.unshift('');
                                        for (var i in optionLists) {
                                            options += '<option value=' + optionLists[i] + '>' + optionLists[i] + '</option>';
                                        }
                                        $('.safe-question-select').html('<select lay-filter="safe-question">' + options + '</select>');
                                        layui.use('form', function () {
                                            var form = layui.form();
                                            form.render();
                                            form.on('select(safe-question)', function (data) {
                                                safeQuestionVal = data.value;
                                            });
                                            //提交密保问题信息验证
                                            $('#find-password-button').click(function () {
                                                var findBySafeQuestion2 = $("#find-answer");
                                                findErrMsg.text('');
                                                myFn.inputFocus(findBySafeQuestion2, findErrMsg);
                                                myFn.inputFocus(findTypeTextCode, findErrMsg);
                                                if (safeQuestionVal == '') {
                                                    findErrMsg.text('请选择密保问题！');
                                                    return
                                                }
                                                if (findBySafeQuestion2.val() == '') {
                                                    findErrMsg.text('请输入答案！');
                                                    return
                                                }
                                                var postInfo={
                                                    'username': userName,
                                                    'safe_question': safeQuestionVal,
                                                    'safe_answer': findBySafeQuestion2.val()
                                                };
                                                if (findTypeTextCodeDiv.css('display') == 'block') {
                                                    if (findTypeTextCode.val() == '') {
                                                        findErrMsg.text('请输入验证码');
                                                        return
                                                    }
                                                    postInfo.code = findTypeTextCode.val();
                                                    postInfo.time = sessionStorage.getItem("forget_code_time");
                                                }
                                                apiRequest.checkSafeQuestion(postInfo,function(res){
                                                    if(res.status==1){
                                                        myLayer.msgPrompt(res.message, function () {
                                                            checkTestInfo(postInfo,1);
                                                        });
                                                    }else{
                                                        //输错5次以上 请输入验证码
                                                        if (res.data.fail_times >=5 ) {
                                                            findTypeTextCodeDiv.show();
                                                            loginCom.forgetGetCode();
                                                        }
                                                        if (findTypeTextCodeDiv.css('display') == 'block') {
                                                            findTypeTextCode.val('');
                                                            loginCom.forgetGetCode();
                                                        }
                                                        if(res.message.indexOf('失败')!=-1){
                                                            findBySafeQuestion2.val('');
                                                        }
                                                        findErrMsg.text(res.message);
                                                    }
                                                });
                                            });

                                        });
                                    });
                                }
                                if (type == '资金密码') {
                                    $('.find-modal-content2 .find-by-payPassword-item').show();
                                    //提交资金密码验证
                                    $('#find-password-button').click(function () {
                                        var findByPayPassword = $("#find-payPassword");
                                        findErrMsg.text('');
                                        myFn.inputFocus(findByPayPassword, findErrMsg);
                                        myFn.inputFocus(findTypeTextCode, findErrMsg);
                                        if (findByPayPassword.val() == '') {
                                            findErrMsg.text('请输入资金密码！');
                                            return
                                        }
                                        if (!(inputRegularObj.pay_password.rule).test(findByPayPassword.val())) {
                                            findErrMsg.text('请输入'+inputRegularObj.pay_password.ruleMsg);
                                            findByPayPassword.val('');
                                            return
                                        }
                                        var postInfo={
                                            'username': userName,
                                            'pay_password':findByPayPassword.val()
                                        };
                                        if (findTypeTextCodeDiv.css('display') == 'block') {
                                            if (findTypeTextCode.val() == '') {
                                                findErrMsg.text('请输入验证码');
                                                return
                                            }
                                            postInfo.code = findTypeTextCode.val();
                                            postInfo.time = sessionStorage.getItem("forget_code_time");
                                        }
                                        apiRequest.checkPayPassword(postInfo,function(res){
                                            if(res.status==1){
                                                myLayer.msgPrompt(res.message, function () {
                                                    checkTestInfo(postInfo,2);
                                                });
                                            }else{
                                                //输错5次以上 请输入验证码
                                                if (res.data.fail_times >=5 ) {
                                                    findTypeTextCodeDiv.show();
                                                    loginCom.forgetGetCode();
                                                }
                                                if (findTypeTextCodeDiv.css('display') == 'block') {
                                                    findTypeTextCode.val('');
                                                    loginCom.forgetGetCode();
                                                }
                                                if(res.message.indexOf('失败')!=-1){
                                                    findByPayPassword.val('');
                                                }
                                                findErrMsg.text(res.message);
                                            }
                                        });
                                    });
                                }
                            });

                        })
                    }
                    //刷新验证码
                    $('.find-modal-content2 .form-item-textCode .client-code').click(function () {
                        loginCom.forgetGetCode();
                    });

                    //第三步，重置密码
                    function checkTestInfo(info, type) {
                        $('.find-modal-content2').hide(60, function () {
                            $('.find-modal-content3').show();
                            $('.find-modal-setup ul li').eq(2).addClass('find-modal-setup-active').siblings('.find-modal-setup ul li').removeClass('find-modal-setup-active');
                            $('.find-modal-setup ul li').eq(0).find('.right-arrow1').css({
                                'border-top': '18px transparent solid',
                                'border-bottom': '18px transparent solid'
                            });
                            $('.find-modal-setup ul li').eq(1).find('.right-arrow1').css({
                                'border-top': '18px #a72d31 solid',
                                'border-bottom': '18px #a72d31 solid'
                            });
                            $('#reset-password').click(function () {
                                postInfo={};
                                var resetPassword1 = $("#set-new-password"),
                                    resetPassword2 = $("#comfirm-new-password");
                                var resetErrMsg = $('.resetPassword-err');
                                resetErrMsg.text('');
                                myFn.inputFocus(resetPassword1, resetErrMsg);
                                myFn.inputFocus(resetPassword2, resetErrMsg);
                                if (resetPassword1.val() == '') {
                                    resetErrMsg.text('请输入新密码！');
                                    return
                                }
                                if (resetPassword2.val() == '') {
                                    resetErrMsg.text('请输入确认新密码！');
                                    return
                                }
                                if (!(inputRegularObj.password.rule).test(resetPassword1.val())) {
                                    resetErrMsg.text('请输入'+inputRegularObj.password.ruleMsg);
                                    return
                                }
                                if (resetPassword1.val() != resetPassword2.val()) {
                                    resetErrMsg.text('新密码与确认新密码不一致！');
                                    resetPassword1.val('');
                                    return
                                }
                                for (var k in info) {
                                    postInfo[k] = info[k];
                                }
                                postInfo.password = resetPassword1.val();
                                postInfo.type = type;
                                apiRequest.passwordReset(postInfo, function (res) {
                                    if (res.status == 1) {
                                        myLayer.msgPrompt(res.message, function () {
                                            //关闭忘记密码框
                                            findPassword.css('display', 'none');
                                            $('#shade').hide();
                                            //打开登录框
                                            $('#login-box').show();
                                        })
                                    } else {
                                        resetPassword1.val('');
                                        resetPassword2.val('');
                                        resetErrMsg.text(res.message);
                                    }
                                });
                            });
                        });
                    }
                }
            });
        });
    }
};

/*—————————首页轮播 弹出框 悬浮图片 公告滚动等—————————*/
/*—————————左右漂浮广告—————————*/
function floatAd(target) {
    $(document).scroll(function () {
        target.animate({'top': $(document).scrollTop() + window.innerHeight / 2}, 30);
    });
}

/*—————————网站公告滚动（首页）—————————*/
//向左无缝滚动
function seamScrollLeft(target, speed) {
    var scrollTimer = null,
        oldLeft = 0,
        newLeft = 0;

    function scrollLeftFn() {
        scrollTimer = setInterval(function () {
            var targetWidth = parseInt(target.css('width'));
            oldLeft = parseInt(target.css('left'));
            newLeft = oldLeft - speed;
            if (newLeft < -targetWidth) {
                newLeft = 970;
            }
            target.css('left', newLeft + 'px');
        }, 200);
    }

    scrollLeftFn();
    target.hover(function () {
        clearInterval(scrollTimer);
    }, function () {
        scrollLeftFn();
    });
}
//单行文字向上滚动
function autoScrollTop(obj,dis) {
    var ulBox = $(obj);
    var scrollTimer = null,
        ulTopVal = 0,
        ulHeight = parseInt(ulBox.height());

    function moveTop() {
        ulTopVal = parseInt(ulBox.css('top'));
        if (ulTopVal < -ulHeight + dis*2) {
            ulBox.css('top', '0px');
        } else {
            ulBox.animate({
                top: ulTopVal - dis + 'px'
            }, 500);
        }
    }

    function start() {
        scrollTimer = setInterval(moveTop, 2000);
    }

    start();
    $(obj).hover(function () {
        clearInterval(scrollTimer);
    }, function () {
        start();
    })
}
var indexAd={
    //根据是否有链接 返回img标签或者a标签
    aOrImg:function(url,src){
        if(url==''){
            return '<img src='+src+' alt="">'
        }else{
            return '<a href='+url+' target="_blank"> <img src='+src+' alt=""></a>'
        }
    },
    //广告弹窗与悬浮
    noticeAd:function() {
        $('.layer-notice .notice-after').html('');
        $('.suspended-picture .notice-before').html('');
        $('.layer-notice .notice-before').html('');
        $('.suspended-picture .notice-after').html('');
        apiRequest.noticeAd( function (adDataObj) {
            var supSlideHtml = '';
            var supBdLi = '';
            if (myCookie.get('indexLayerShow')) {
                //首页弹窗图片 登录后
                if(adDataObj.layerAfter.length>0){
                    if(!myCookie.get('layerAfter')){
                        var layerAfterLi='';
                        for(var a in adDataObj.layerAfter){
                            layerAfterLi+='<li><div class="notice-box">' +
                                '<div class="find-modal-close"><i class="icon-close"></i></div>'
                                +indexAd.aOrImg(adDataObj.layerAfter[a].url,adDataObj.layerAfter[a].image)+'</div></li>';
                        }
                        $('.layer-notice .notice-after').html(layerAfterLi);
                        $('.find-modal-close').click(function () {
                            $(this).parents('li').hide();
                        });
                        myCookie.set('layerAfter',1);
                    }
                }
                //首页悬浮图片 登录后
                if(adDataObj.suspendAfter.length>0){
                    if(adDataObj.suspendAfter.length>1){
                        //多张图  可轮播
                        for(var b in adDataObj.suspendAfter){
                            supBdLi+='<li>'+indexAd.aOrImg(adDataObj.suspendAfter[b].url,adDataObj.suspendAfter[b].image)
                                +'<div class="find-modal-close" data-index="'+b+'"><i class="icon-close"></i></div></li>';
                        }
                        supSlideHtml = '<div class="bd"><ul class="slide-item">'+supBdLi+'</ul></div>';
                        $('.suspended-picture .notice-after').html(supSlideHtml);
                        jQuery(".suspended-picture .notice-after").slide(
                            {mainCell: ".bd ul", autoPlay: true,interTime:5000}
                        );
                    }else{
                        //只有一张图  没有左右按钮  没有切换按钮
                        supBdLi = '<li>'+indexAd.aOrImg(adDataObj.suspendAfter[0].url,adDataObj.suspendAfter[0].image)
                            +'<div class="find-modal-close" data-index="0"><i class="icon-close"></i></div></li>';
                        $('.suspended-picture .notice-after').html(supBdLi);
                    }
                    $('.suspended-picture .notice-after .find-modal-close').click(function(){
                        var dataIndex  = $(this).attr('data-index');
                        adDataObj.suspendAfter.splice(dataIndex, 1);
                        sessionStorage.setItem("adData", JSON.stringify(adDataObj));
                        //刷新列表
                        indexAd.noticeAd();
                    });
                }
            }else{
                //首页弹窗图片 登录前
                if(adDataObj.layerBefore.length>0){
                    if(!myCookie.get('layerBefore')){
                        var layerBeforeLi='';
                        for(var c in adDataObj.layerBefore){
                            layerBeforeLi+='<li><div class="notice-box">' +
                                '<div class="find-modal-close"><i class="icon-close"></i></div>'
                                +indexAd.aOrImg(adDataObj.layerBefore[c].url,adDataObj.layerBefore[c].image)+'</div></li>';
                        }
                        $('.layer-notice .notice-before').html(layerBeforeLi);
                        $('.find-modal-close').click(function () {
                            $(this).parents('li').hide();
                        });
                        myCookie.set('layerBefore',1);
                    }
                }
                //首页悬浮图片 登录前
                if(adDataObj.suspendBefore.length>0){
                    if(adDataObj.suspendBefore.length>1){
                        //多张图  可轮播
                        for(var d in adDataObj.suspendBefore){
                            supBdLi+='<li>'+indexAd.aOrImg(adDataObj.suspendBefore[d].url,adDataObj.suspendBefore[d].image)
                                +'<div class="find-modal-close" data-index="'+d+'"><i class="icon-close"></i></div></li>';
                        }
                        supSlideHtml = '<div class="bd"><ul class="slide-item">'+supBdLi+'</ul></div>';
                        $('.suspended-picture .notice-before').html(supSlideHtml);
                        jQuery(".suspended-picture .notice-before").slide(
                            {mainCell: ".bd ul", autoPlay: true,interTime:5000}
                        );
                    }else{
                        //只有一张图
                        supBdLi = '<li>'+indexAd.aOrImg(adDataObj.suspendBefore[0].url,adDataObj.suspendBefore[0].image)
                            +'<div class="find-modal-close" data-index="0"><i class="icon-close"></i></div></li>';
                        $('.suspended-picture .notice-before').html(supBdLi);
                    }
                    $('.suspended-picture .notice-before .find-modal-close').click(function(){
                        var dataIndex  = $(this).attr('data-index');
                        adDataObj.suspendBefore.splice(dataIndex, 1);
                        sessionStorage.setItem("adData", JSON.stringify(adDataObj));
                        //刷新列表
                        indexAd.noticeAd();
                    });
                }
            }
            //轮播图
            if(adDataObj.banner.length>0){
                var slideHtml = '';
                var hdLi = '';
                var bdLi = '';
                if(adDataObj.banner.length>1){
                    //多张图  可轮播
                    for(var i in adDataObj.banner){
                        hdLi +='<li></li>';
                        bdLi +='<li>'+indexAd.aOrImg(adDataObj.banner[i].url,adDataObj.banner[i].image)+'</li>';
                    }
                    slideHtml = '<div class="hd pagination-circle"><ul>'+hdLi+'</ul></div>' +
                        '<div class="bd"><ul class="slide-item">'+bdLi+'</ul></div>' +
                        '<a class="next slideBtn" href="javascript:void(0)"><i class="icon-right"></i></a>' +
                        '<a class="prev slideBtn" href="javascript:void(0)"><i class="icon-back"></i></a>';
                    $('#promotion-con-slide').html(slideHtml);
                    jQuery("#promotion-con-slide").slide(
                        {mainCell: ".bd ul", autoPlay: true, trigger: "click", interTime: 3000}
                    );
                }else{
                    //只有一张图  没有左右按钮  没有切换按钮
                    bdLi = '<li>'+indexAd.aOrImg(adDataObj.banner[0].url,adDataObj.banner[0].image)+'</li>';
                    slideHtml = '<div class="bd"><ul class="slide-item">'+bdLi+'</ul></div>';
                    $('#promotion-con-slide').html(slideHtml);
                }
            }else{
                //显示默认的  两张图
                hdLi = '<li></li><li></li>';
                bdLi = '<li><img src="./quote/images/banner1.jpg" alt=""></li><li><img src="./quote/images/banner2.jpg" alt=""></li>';
                slideHtml = '<div class="hd pagination-circle"><ul>'+hdLi+'</ul></div>' +
                    '<div class="bd"><ul class="slide-item">'+bdLi+'</ul></div>' +
                    '<a class="next slideBtn" href="javascript:void(0)"><i class="icon-back"></i></a>' +
                    '<a class="prev slideBtn" href="javascript:void(0)"><i class="icon-right"></i></a>';
                $('#promotion-con-slide').html(slideHtml);
                jQuery("#promotion-con-slide").slide(
                    {mainCell: ".bd ul", autoPlay: true, trigger: "click", interTime: 5000}
                );
            }
        });
    },
    //公告滚动
    noticeScroll:function(dis) {
        //从后台获取最新公告信息
        apiRequest.noticeScroll(function (res) {
            var noticeData = res.data;
            var noticeLi = '';
            for (var i in noticeData) {
                if (noticeData[i].url != '') {
                    noticeLi += '<a href="' + noticeData[i].url + '" target="_blank"><div class="ann-title">' + noticeData[i].title + '<p>   ' + noticeData[i].created_at + '</p></div>' +
                        '<p class="ann-content">' + noticeData[i].content + '</p></a>';
                } else {
                    noticeLi += '<a href="javascript:void(0)" class="ann-content-more" data-title=' + noticeData[i].title + ' data-date=' + noticeData[i].created_at + '>' +
                        '<div class="ann-title">' + noticeData[i].title + '<p>  ' + noticeData[i].created_at + '</p></div>' +
                        '<p class="ann-content">' + noticeData[i].content + '</p></a>';
                }
            }
            $('.announcement-scroll').html(noticeLi);
            //上下滚动  默认按照行高 25px 如有其他情况 单独设置
            if(dis){
                autoScrollTop(".announcement-scroll",dis); //自己封装的
            }else{
                autoScrollTop(".announcement-scroll",25); //自己封装的
            }
            //点击出现详情
            $('.ann-content-more').click(function () {
                var annTitle = $(this).attr('data-title');
                var annContent = $(this).find('.ann-content').text();
                var annDate = $(this).attr('data-date');
                //详情的内容
                $('.announcement-detail .title').html(annTitle + '<span>  | ' + annDate.split(' ')[0] + '</span>');
                $('.announcement-detail .ann-content').html(annContent);
                myLayer.openContent('公告详情', $('.announcement-detail'));
            });
            //繁简互换
            langChange($('.announcement'));
            langChange($('.announcement-detail'));
        });
    }
};

/*—————————优惠活动页面—————————*/
var preferential={
    tab:function(){
        $('.preferential-tab li').click(function(){
            var liIndex = $(this).index();
            var lineLeft = parseInt(80*liIndex);
            $(this).addClass('preferential-tab-active').siblings('.preferential-tab li').removeClass('preferential-tab-active');
            $('.line-slider').animate({'left':lineLeft+'px'},400,'swing');
            $('.preferential-box ul').eq(liIndex).fadeIn(200).siblings('.preferential-box ul').fadeOut(80);
        })
    },
    //获取配置活动列表  新页面打开形式
    getListNewOpen:function(){
        var activeAllUl = $('.preferential-box ul.all-active');
        activeAllUl.html('');
        apiRequest.actLists(function(res){
            var activeLi = '';
            if(res.status==1){
                var lists = res.data.list;
                for(var ac=0;ac<lists.length;ac++){
                    if(lists[ac].status!=4){
                        activeLi+='<li class="preferential-li">' +
                            '<div class="preferential-item clearfix">' +
                            '<div class="preferential-item-l">' +
                            '<div class="preferential-state preferential-state'+lists[ac].status+'"></div>' +
                            '<div class="preferential-line"></div>' +
                            '</div>' +
                            '<div class="preferential-item-r">' +
                            '<div class="preferential-item-r-img"><img src='+lists[ac].pc_cover+'></div>' +
                            '<div class="preferential-item-r-text">' +
                            '<h3>'+lists[ac].activity_name+'</h3><p>活动时间：'+lists[ac].start_time+' 至 '+lists[ac].end_time+'</p><p>'+lists[ac].describe+'</p>' +
                            '<div class="preferential-more"><a href="javascript:void(0)" data-id='+lists[ac].id+' class="active-detail">查看详细</a></div>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '</li>';
                    }
                }
                activeAllUl.html(activeLi);
                //查看详情
                preferential.detailNewOpen();
            }
        })
    },
    //查看详情  新页面打开形式
    detailNewOpen:function(){
        $('.all-active .active-detail').click(function(){
            var activeId = $(this).attr('data-id');
            window.open('preferentialDetail.html?id='+activeId);
        });
    },
    //新页面打开形式
    pageInitNewOpen:function(){
        this.tab();
        this.getListNewOpen();
    },

    //获取配置活动列表  当前页面折叠
    getListThisOpen:function(){
        var activeAllUl = $('.preferential-box ul.all-active');
        activeAllUl.html('');
        apiRequest.actLists(function(res){
            var activeLi = '';
            if(res.status==1){
                var lists = res.data.list;
                for(var ac=0;ac<lists.length;ac++){
                    if(lists[ac].status!=4){
                        activeLi+='<li class="preferential-li-img"> ' +
                            '<div class="activity-img"  data-id='+lists[ac].id+'><img src="'+lists[ac].pc_cover+'" alt=""></div>' +
                            '<div class="iframe-box">' +
                            '<div class="active-title"></div>' +
                            '<div class="active-time"></div>' +
                            '<div class="active-details"><iframe name="details-iframe"  frameborder="0"></iframe></div>' +
                            '</div>' +
                            '</li>';
                    }
                }
                activeAllUl.html(activeLi);
                //查看详情
                preferential.detailThisOpen();
            }
        })
    },
    //查看详情  当前页面打开形式
    detailThisOpen:function(){
        $('.all-active .preferential-li-img .activity-img').click(function(){
            var activeId = $(this).attr('data-id');
            var thisLi = $(this);
            if( thisLi.next('.iframe-box').css('display')=='block'){
                thisLi.next('.iframe-box').slideUp();
            }
            if(thisLi.next('.iframe-box').css('display')=='none'){
                if(thisLi.next('.iframe-box').find('.active-title').html()!=''){
                    $('.all-active .preferential-li-img .iframe-box').slideUp();
                    thisLi.next('.iframe-box').slideDown();
                }else{
                    apiRequest.actDetails({
                        activity_id:activeId
                    },function(res){
                        if(res.status==1){
                            thisLi.next('.iframe-box').find('.active-title').html(res.data.activity_name);
                            thisLi.next('.iframe-box').find('.active-time').html(res.data.start_time+' 至 '+res.data.end_time);
                            thisLi.next('.iframe-box').find('.active-details').html(res.data.activity_details);
                            $('.all-active .preferential-li-img .iframe-box').slideUp();
                            thisLi.next('.iframe-box').slideDown();
                        }
                    });
                }
            }
        });
    },
    //当前页面打开形式
    pageInitThisOpen:function(){
        this.tab();
        this.getListThisOpen();
    }
};

/*—————————签到—————————*/
//首页刷新签到状态
function signInStatusIndex() {
    if (pangu.myData.switch_sign == 1) {   //签到开关
        $('.right-bar-signIn').hide();
    } else {
        $('.right-bar-signIn').show();
        if (pangu.myData.sign_status == 1) {  //已签到
            $('.right-bar-signIn .right-bar-signIn-r a').hide();
            $('.right-bar-signIn .right-bar-signIn-r span').show();
            // $('.right-bar-signIn .right-bar-signIn-l span').html(res.data.continuity_num);
        } else {    //未签到
            $('.right-bar-signIn .right-bar-signIn-r a').show();
            $('.right-bar-signIn .right-bar-signIn-r span').hide();
            // $('.right-bar-signIn .right-bar-signIn-l span').html(res.data.continuity_num);
        }
    }
}
//个人中心刷新签到状态
function signInStatusUser() {
    if (pangu.myData.switch_sign == 1) {   //签到开关
        $('.sign-in-btn').hide();
    } else {
        $('.right-bar-signIn').show();
        if (pangu.myData.sign_status == 1) {  //已签到
            $('.sign-in-btn').show();
            $('.sign-in-btn a').show();
            $('.sign-in-btn span').hide();
        } else {    //未签到
            $('.sign-in-btn').show();
            $('.sign-in-btn a').hide();
            $('.sign-in-btn span').show();
        }
    }
}
//请求签到数据  打开签到弹出框
function signInFnOpen() {
    apiRequest.actSign(function (res) {
        if (res.status == 1) {
            var signInRes = res.data;
            var signIn = $('#signIn');
            if (signIn.length == 0) {
                var signInBox = '<div id="signIn" style="display: none;"></div>';
                $('body').append(signInBox);
                signIn = $('#signIn');
            }
            pangu.myData.sign_status = 1;
            myCookie.set("myData", JSON.stringify(pangu.myData));
            //首页
            if (window.location.href.indexOf('user/') == -1) {
                signIn.load('../../pub/view/sign_in.html', function (responseText, textStatus, XMLHttpRequest) {
                    if (textStatus == 'success') {
                        signIn.html(responseText);
                        signInShow(signInRes);
                        //刷新签到状态
                        signInStatusIndex();
                        //刷新余额
                        apiRequest.refreshBalance();
                    }
                });
            } else {
                //个人中心
                signIn.load('../../../pub/view/sign_in.html', function (responseText, textStatus, XMLHttpRequest) {
                    if (textStatus == 'success') {
                        signIn.html(responseText);
                        signInShow(signInRes);
                        //显示签到状态
                        signInStatusUser();
                        //刷新余额
                        apiRequest.refreshBalance();
                    }
                });
            }
        }
    })
}
//显示签到结果
function signInShow(signInRes) {
    $('.sign-in-box').hide();
    //显示所有签到详情  积分或者彩金为0则不显示
    var signInCont = signInRes.content;
    var signInLi = '';
    for (var s = 0; s < signInCont.length; s++) {
        if (signInCont[s].checked == 1) {
            if(signInCont[s].point!=0 && signInCont[s].balance!=0){
                signInLi += '<li class="sign-active"><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].point + '积分</p><p>+' + signInCont[s].balance + '元</p><i></i></li>';
            }else if(signInCont[s].point==0 && signInCont[s].balance!=0){
                signInLi += '<li class="sign-active"><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].balance + '元</p><i></i></li>';
            }else if(signInCont[s].point!=0 && signInCont[s].balance==0){
                signInLi += '<li class="sign-active"><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].point + '积分</p><i></i></li>';
            }else{
                signInLi += '<li class="sign-active"><h3>第' + (parseInt(s) + 1) + '天</h3><i></i></li>';
            }
            //signInLi += '<li class="sign-active"><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].point + '积分</p><p>+' + signInCont[s].balance + '元</p><i></i></li>';
        } else {
            if(signInCont[s].point!=0 && signInCont[s].balance!=0){
                signInLi += '<li><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].point + '积分</p><p>+' + signInCont[s].balance + '元</p><i></i></li>';
            }else if(signInCont[s].point==0 && signInCont[s].balance!=0){
                signInLi += '<li><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].balance + '元</p><i></i></li>';
            }else if(signInCont[s].point!=0 && signInCont[s].balance==0){
                signInLi += '<li><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].point + '积分</p><i></i></li>';
            }else{
                signInLi += '<li><h3>第' + (parseInt(s) + 1) + '天</h3><i></i></li>';
            }
            //signInLi += '<li><h3>第' + (parseInt(s) + 1) + '天</h3><p>+' + signInCont[s].point + '积分</p><p>+' + signInCont[s].balance + '元</p><i></i></li>';
        }
    }
    $('.sign-in-box .content ul').html(signInLi);
    if(signInCont.length>7){
        //月签
        $('.sign-in-month').show();
        //弹出层
        layer.open({
            type: 1,
            skin:'layer-no-bg',
            shade: 0.3,
            area: '855px',
            closeBtn: 0, //不显示关闭按钮
            title: false, //不显示标题
            content: $('#signIn'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            success:function(){
                //右侧高度
                var flHeight = $('.sign-in-month .fl').css('height');
                $('.sign-in-month .fr').css('height',flHeight);
            }
        });
    }else{
        //周签
        $('.sign-in-week').show();
        //弹出层
        layer.open({
            type: 1,
            skin:'layer-no-bg',
            shade: 0.3,
            area: '593px',
            closeBtn: 0, //不显示关闭按钮
            title: false, //不显示标题
            content: $('#signIn') //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
        });
    }
    //显示今天签到情况
    if (signInRes.sign_flag == 1) {
        //满足签到条件
        $('.sign-in-box .sign-user .sign-fail').hide();
        $('.sign-in-box .sign-user .sign-suc').show();
        //今日积分
       /* //积分为0不显示
       if(signInRes.today.point==0){
            $('.sign-in-box .sign-user .today-point').hide();
        }else{
            $('.sign-in-box .sign-user .today-point').show();
            $('.sign-in-box .sign-user .today-point em').html(signInRes.today.point);
        }*/
        $('.sign-in-box .sign-user .today-point').show();
        $('.sign-in-box .sign-user .today-point em').html(signInRes.today.point);
        //今日送钱
       /*//送钱为0不显示
       if(signInRes.today.balance==0){
           $('.sign-in-box .sign-user .today-money').hide();
       }else{
           $('.sign-in-box .sign-user .today-money').show();
           $('.sign-in-box .sign-user .today-money em').html(signInRes.today.balance);
       }*/
        $('.sign-in-box .sign-user .today-money').show();
        $('.sign-in-box .sign-user .today-money em').html(signInRes.today.balance);
        //连续签到天数
        $('.sign-in-box .sign-user .continue-num').html(signInRes.continue_day);
        //明日积分
       /* //积分为0不显示
       if(signInRes.tomorrow.point==0){
            $('.sign-in-box .sign-user .tomorrow-point').hide();
        }else{
            $('.sign-in-box .sign-user .tomorrow-point').show();
            $('.sign-in-box .sign-user .tomorrow-point em').html(signInRes.tomorrow.point);
        }*/
        $('.sign-in-box .sign-user .tomorrow-point').show();
        $('.sign-in-box .sign-user .tomorrow-point em').html(signInRes.tomorrow.point);
        //明日送钱
        /*//送钱为0不显示
        if(signInRes.tomorrow.balance==0){
            $('.sign-in-box .sign-user .tomorrow-money').hide();
        }else{
            $('.sign-in-box .sign-user .tomorrow-money').show();
            $('.sign-in-box .sign-user .tomorrow-money em').html(signInRes.tomorrow.balance);
        }*/
        $('.sign-in-box .sign-user .tomorrow-money').show();
        $('.sign-in-box .sign-user .tomorrow-money em').html(signInRes.tomorrow.balance);
    } else {
        //不满足签到条件
        $('.sign-in-box .sign-user .sign-suc').hide();
        $('.sign-in-box .sign-user .sign-fail h1').html(signInRes.title);
        $('.sign-in-box .sign-user .sign-fail').show();
    }

    //显示签到规则
    var signInRule = signInRes.sign_rule;
    var ruleItem = '';
    for (var r = 0; r < signInRule.length; r++) {
        ruleItem += '<p>' + signInRule[r] + '</p>';
    }
    $('.sign-in-box .rule').append(ruleItem);

    //繁简互换
    langChange($('#signIn'));

    //关闭弹出层
    $('.sign-in-box .icon-close').click(function () {
        layer.closeAll();
    })
}

/*—————————积分查询—————————*/
var point={
    pageNum:0,  //页数
    pageSize:8,   //10个为1页
    //打开弹出框
    openModal:function(){
        var pointBox = $('#pointBox');
        if (pointBox.length == 0) {
            var pointBoxBox = '<div id="pointBox"></div>';
            $('body').append(pointBoxBox);
            pointBox = $('#pointBox');
        }
        if (window.location.href.indexOf('user/') == -1){
            //首页
            pointBox.load('../../pub/view/point_box.html', function (responseText, textStatus, XMLHttpRequest) {
                if (textStatus == 'success') {
                    pointBox.html(responseText);
                    myLayer.openContentTop('700px', '积分详情', pointBox);
                    point.getLists(1);
                }
            });
        }else{
            //个人中心
            pointBox.load('../../../pub/view/point_box.html', function (responseText, textStatus, XMLHttpRequest) {
                if (textStatus == 'success') {
                    pointBox.html(responseText);
                    myLayer.openContentTop('700px', '积分详情', pointBox);
                    point.getLists(1);
                }
            });
        }
    },
    //获取积分数据
    getLists:function(page){
        var pointPostInfo = {
            'page': page,
            'size': point.pageSize
        };
        apiRequest.hlPointLog(pointPostInfo, function (res) {
            if (res.status == 1) {
                //渲染数据
                var pointList = '';
                var pointDetails = res.data.list;
                if (pointDetails.length > 0) {
                    for (var pl = 0; pl < pointDetails.length; pl++) {
                        pointList += '<li><span>' + pointDetails[pl].created_at + '</span><span>' + pointDetails[pl].points_change + '</span><span>' + pointDetails[pl].remark + '</span></li>';
                    }
                } else {
                    pointList = '<p>暂无数据</p>'
                }
                $('.point-box .list').html(pointList);
                //显示分页
                var resAccount = res.data.count;
                point.pageNum =  Math.ceil(resAccount/point.pageSize);
                layui.use('laypage', function () {
                    var laypage = layui.laypage;
                    laypage({
                        cont: 'point-pagination'
                        , pages: point.pageNum
                        , curr: page
                        , groups: 3
                        //调用分页
                        , jump: function (obj,first) {
                            if(!first){
                                point.getLists(obj.curr)
                            }
                        }
                    });
                });
                if (point.pageNum > 1) {
                    $('.point-box .page-box').show();
                } else {
                    $('.point-box .page-box').hide();
                }

            }
        });
    }

};

/*—————————繁简互换—————————*/
//（只能作用于页面上存在的，如果要load  html模块，需再执行一次）
if (localStorage.language == 'hk') {
    $('.wrapper').s2t();
} else if (localStorage.language == 'cn') {
    $('.wrapper').t2s();
}
function langChange(tar) {
    //tar  表示最外层div
    if (localStorage.language == 'hk') {
        tar.s2t();
    } else if (localStorage.language == 'cn') {
        tar.t2s();
    }
}


/*—————————刷新页面 跟新余额—————————*/
window.onload = function(){
    if(myCookie.get('pgToken')){
        apiRequest.refreshBalance();
    }
};











