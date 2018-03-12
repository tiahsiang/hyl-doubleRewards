//验证登录 没有登录提示登录
function testLogin(sureFn) {
    if (pangu.myData.username && myCookie.get('pgToken')) {
        sureFn();
    } else {
        myLayer.promptBox('您还没有登录！', '立即登录', function (index) {
            layer.close(index);
            $('body,html').animate({scrollTop: 0}, 200, function () {
                $('#login-box').show();
            });
        })
    }
}
function openLoginBox(){
    myLayer.promptBox('您还没有登录！', '立即登录', function (index) {
        if (pangu.myData.username && !myCookie.get('pgToken')) {
            window.location.reload();
        }
        layer.close(index);
        $('body,html').animate({scrollTop: 0}, 200, function () {
            $('#login-box').show();
        });
    }, function () {
        if (pangu.myData.username && !myCookie.get('pgToken')) {
            window.location.reload();
        }
    })
}
/***************************页面公共部分************************/
var indexCom={
    /**********头部************/
    //时间显示
    headerTime:function(){
        //顯示當地時間
        var localLocale = '';
        setInterval(function () {
            var arr =new Date();
            var Y = arr.getFullYear();
            var Mh = arr.getMonth() + 1;
            if(Mh > 12) Mh = 01;
            if(Mh < 10) Mh = '0'+Mh;
            var D = arr.getDate()  < 10 ? '0'+arr.getDate():arr.getDate();
            var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
            var Day=arr.getDay();
            var H = arr.getHours() < 10 ? '0'+arr.getHours():arr.getHours();
            var M = arr.getMinutes() < 10 ? '0'+arr.getMinutes():arr.getMinutes();
            var S = arr.getSeconds() < 10 ? '0'+arr.getSeconds():arr.getSeconds();
            var showText;
            var h=arr.getHours();
            if(h>=6&&h<9){
                showText='即将开始繁忙的一天，记得吃早餐!';
            }else if(h>=9&&h<12){
                showText='一日之计在于晨，愿好运相伴！';
            }else if(h>=12&&h<14){
                showText='午餐时间到了，吃好吃饱最重要!'
            }else if(h>=14&&h<18){
                showText='多起立活动，保持良好精神状态!'
            }else if(h>=18&&h<20){
                showText='晚饭时间，好好犒劳一下自己吧！'
            }else if(h>=20&&h<23){
                showText='娱乐黄金时间！来，战个痛快！'
            }else {
                showText='夜深了，早点休息!'
            }
            localLocale = Y+'年'+Mh+'月'+D+'日 '+show_day[Day]+' '+H+':'+M+':'+S+' GMT+0800'+'<em>'+showText+'</em>';
            $('.update-date').html(localLocale);
        }, 1000);
    },
    //语言选择
    headerLan:function(){
        //香港繁体
        $('.flag-hk').click(function () {
            $('.wrapper').s2t();
            localStorage.language = 'hk';
        });
        //中国简体
        $('.flag-cn').click(function () {
            $('.wrapper').t2s();
            localStorage.language = 'cn';
        });
    },
    //登录前
    loginBefore:function(){
        $('.header-title').load('quote/view/login_before.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                $('.header-title').html(responseText);
                indexCom.headerTime();
                indexCom.headerLan();
                //繁简互换
                langChange($('.header-title'));
                //头部是否显示注册字段
                if (pangu.myParam.site && pangu.myParam.site.switch_register == 1) {
                    $('.login-modal .login-link').show();
                    $('.before-login .reg-btn-open').show();
                } else {
                    $('.login-modal .login-link').hide();
                    $('.before-login .reg-btn-open').hide();
                }
                //打开登录框
                $('#login-enter').click(function () {
                    $('#login-box').show();
                    $('#login-code-input').hide();
                    $('.login-modal .form-item-err').text('');
                });
                //刷新验证码
                $('#login-client-code').click(function () {
                    loginCom.getCode();
                });
                //关闭登录框
                $('#login-close').click(function () {
                    $('#login-box').hide();
                });
                //登录
                $('#login').click(function () {
                    loginCom.login();
                });
                $("body").keydown(function () {
                    if (event.keyCode == "13") {  //keyCode=13是回车键
                        loginCom.login();
                    }
                });
                //忘记密码
                loginCom.forgetPassword();

                //打开客服
                $('.before-login .float-modal-footer .online-service').click(function () {
                    indexCom.custom();
                });
            }
        });
    },
    //登录后
    loginAfter:function(){
        $('.header-title').load('quote/view/login_after.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                $('.header-title').html(responseText);
                indexCom.headerTime();
                indexCom.headerLan();
                //繁简互换
                langChange($('.header-title'));
                //登录状态下显示用户名 余额等信息
                if (pangu.myData.username) {
                    $('.user-username-show').html(pangu.myData.username);
                    $('.user-money-show').html(pangu.myData.balance);
                }
                //刷新余额
                $('.after-login .icon-update').click(function () {
                    apiRequest.refreshBalance();
                });
                //跳到充值页面
                $('.after-login .goTo-recharge').click(function () {
                    localStorage.accountManageLink = 0;
                    window.open('user/account.html');
                });
                //退出
                $('.logoff').click(function () {
                    apiRequest.userLogout(function(){
                        indexCom.loginStatus();
                        //首页刷新弹框状态
                        if(indexAd.noticeAd){
                            indexAd.noticeAd();
                        }
                    });
                });
            }
        });
    },
    /**********导航************/
    navTab:{
        '': 1,
        'index': 1,
        'sport': 2,
        'live': 3,
        'casino': 4,
        'lottery': 5,
        'preferential': 6
    },
    //头部导航
    nav:function(){
        var headerNav = $('.header-nav');
        headerNav.load('quote/view/nav.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                headerNav.html(responseText);
                //导航
                $('.header-content .main-nav .main-nav-item' + myFn.urlTran(location.href,indexCom.navTab) + '').html('<a class="main-nav-active" href="javascript:void(0)"></a> <div class="main-nav-drop"></div>');
                //显示二级菜单（如果电子游戏和彩票要显示二级菜单 直接在html页面增加hasSubNav 和相关数据）
                var subNavTimer = null;
                $('.hasSubNav').hover(function () {
                    var subType = $(this).attr('data-type');
                    var subName = $(this).attr('data-name');
                    var thisSubNav = $(this).find('.sub-nav');
                    apiRequest.gameList(function(){
                        indexCom.navGame(subName, subType);
                    });
                    subNavTimer = setTimeout(function () {
                        thisSubNav.show(300);
                    }, 200);
                }, function () {
                    clearTimeout(subNavTimer);
                    $(this).find('.sub-nav').hide(300);
                });
            }
        });
    },
    //显示二级菜单
    navGame:function(subName, subType) {
        var subNavLists = pangu.myParam['game'+subType];
        var subNavLi = '';
        //体育 真人（点击直接弹出额度转换 进入游戏，识别因素 class="openfastTransfer"）
        if (subType == 1 || subType == 3) {
            for (var i = 0; i < subNavLists.length; i++) {
                subNavLi += '<li class="openfastTransfer" data-title="'+subNavLists[i].name+'" data-id='+subNavLists[i].id+'>' +
                    '<i class="icon-'+subNavLists[i].image_code+'"></i><span>'+subNavLists[i].name+'</span></li>';
            }
        }
        //电子  彩票(点击跳到电子或者 彩票页面)
        if (subType == 2 || subType == 4) {
            for (var i = 0; i < subNavLists.length; i++) {
                if(subNavLists[i].name=='BBIN电子游戏'){
                    subNavLi += '<li class="subNav-' + subName + '-href-item" data-index='+i+'>' +
                        '<i class="icon-'+subNavLists[i].image_code+ '"></i><span>BBIN游戏</span></li>';
                }else{
                subNavLi += '<li class="subNav-' + subName + '-href-item" data-index='+i+'>' +
                    '<i class="icon-'+subNavLists[i].image_code+ '"></i><span>'+subNavLists[i].name+'</span></li>';
                }
            }

        }
        $('.hasSubNav .' + subName + '-category').html(subNavLi);

        //体育 真人
        gameInBeforeFn();
        //点击平台进入  彩票 电子 跳转到相应页面
        $('.subNav-' + subName + '-href-item').off();
        $('.subNav-' + subName + '-href-item').on('click', function () {
            var hrefIndex = $(this).attr('data-index');
            myCookie.set(subName + 'Index', hrefIndex);
            window.location.href = subName + '.html';
        });
    },
    /**********右边栏************/
    rightBarCom:function(){
        //右边栏鼠标悬停效果
        $('.right-bar-tab-item').hover(function () {
            $(this).find('.tab-item-ico').css('background-color', '#cf2f2f');
            $(this).find('.tab-item-tips').show(80, function () {
                $(this).css({
                    'opacity': '1',
                    'right': '35px',
                    'transition': 'all .3s ease-out'
                });
            });
        }, function () {
            $(this).find('.tab-item-ico').css('background-color', '#0d0d0d');
            $(this).find('.tab-item-tips').hide(80, function () {
                $(this).css({
                    'opacity': '0',
                    'right': '80px',
                    'transition': 'all .3s ease-out'
                });
            })
        });

        /*****客服*****/
        $('.right-bar-tabs .online-service').click(function () {
            indexCom.custom();
        });

        /*****二维码*****/
        $('#open-mobileBet').click(function(){
            window.open('mobileBet/index.html');
        });

        /*****回到顶部按钮*****/
        $(document).scroll(function () {
            var top = $(document).scrollTop();
            if (top >= 200) {
                $(".button-go-top").show();
            } else {
                $(".button-go-top").hide();
            }
        });
        $('.button-go-top').click(function () {
            $('body,html').animate({scrollTop: 0}, 500);
        });
    },
    //登录前
    rightBarBefore:function() {
        var rightBar = $('.right-bar');
        rightBar.load('quote/view/right_bar.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                rightBar.html(responseText);
                /*****我的账户*****/
                $('#open-myAccount').click(function () {
                    openLoginBox();
                });
                /*****红利*****/
                $('#open-myBonus').click(function () {
                    openLoginBox();
                });
                /*****充值*****/
                $('#open-myRecharge').click(function () {
                    openLoginBox();
                });
                /*****消息*****/
                $('#open-myInfo').click(function () {
                    openLoginBox();
                });
                //繁简互换
                langChange(rightBar);
                //右侧栏不分登录
                indexCom.rightBarCom();
            }
        });
    },
    //登录后
    rightBarAfter:function() {
        var rightBar = $('.right-bar');
        rightBar.load('quote/view/right_bar.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                rightBar.html(responseText);
                //右边栏关闭
                $('.right-bar-close').click(function () {
                    rightBar.animate({'right': '-235px'}, 'swing');
                });
                //展开右边栏   我的账户  红利
                function rightBarOpenFn(thisBar) {
                    var rightBarTitle = thisBar.find('.tab-item-tips span').text();
                    var rightBarContent = $('.right-bar-plugins > div');
                    rightBarContent.removeClass('animated bounceInUp');
                    rightBarContent.hide();
                    //我的红利去掉滚动条
                    $('#my-bonus-scroll').mCustomScrollbar("destroy");

                    var oldIndex = myCookie.get('tabOpenText');
                    if (oldIndex == rightBarTitle) {
                        if (rightBar.css('right') == "-235px") {
                            rightBar.animate({'right': '0'}, 'swing');
                            rightBarChangeFn(rightBarTitle);
                        } else {
                            rightBar.animate({'right': '-235px'}, 'swing');

                        }
                        myCookie.set('tabOpenText', rightBarTitle);
                    } else {
                        rightBar.animate({'right': '0'}, 'swing');
                        myCookie.set('tabOpenText', rightBarTitle);
                        rightBarChangeFn(rightBarTitle);
                    }
                }
                //红利与我的账户切换
                function rightBarChangeFn(rightBarTitle) {
                    if (rightBarTitle == '我的帐户' || rightBarTitle == '我的帳戶') {
                        $('.my-account').show(10, function () {
                            $(this).addClass('animated bounceInUp');
                            //用户完善个人信息状态
                            var userInfoPercent = 50;
                            if (!!pangu.myData.bind_pay_password) {
                                userInfoPercent = userInfoPercent + 10;
                            }
                            if (!!pangu.myData.realname) {
                                userInfoPercent = userInfoPercent + 10;
                            }
                            if (!!pangu.myData.mobile) {
                                userInfoPercent = userInfoPercent + 5;
                            }
                            if (!!pangu.myData.bind_safe_question) {
                                userInfoPercent = userInfoPercent + 5;
                            }
                            if (!!pangu.myData.email) {
                                userInfoPercent = userInfoPercent + 5;
                            }
                            if (!!pangu.myData.birthday) {
                                userInfoPercent = userInfoPercent + 5;
                            }
                            if (!!pangu.myData.qq) {
                                userInfoPercent = userInfoPercent + 5;
                            }
                            if (!!pangu.myData.receive_address) {
                                userInfoPercent = userInfoPercent + 5;
                            }
                            var userInfoPercentBox = $('.right-bar-container-userinfo .right-bar-user-info-l');
                            userInfoPercentBox.html('');
                            if (userInfoPercent != 100) {
                                userInfoPercentBox.removeClass('icon-user2');
                                if (document.querySelector && !window.addEventListener) {
                                    //ie8
                                    userInfoPercentBox.html(userInfoPercent + '%');
                                } else {
                                    userInfoPercentBox.css('border', 'none');
                                    $('#indicatorContainer').radialIndicator({
                                        barColor: '#41a161',
                                        radius: 37,
                                        barWidth: 3,
                                        initValue: userInfoPercent,
                                        roundCorner: true,
                                        percentage: true
                                    });
                                }
                                userInfoPercentBox.click(function () {
                                    window.open('user/info.html');
                                });
                            } else {
                                userInfoPercentBox.css({
                                    'border': '3px solid transparent',
                                    'cursor': 'auto',
                                    'background': 'url(../../pub/images/user-logo.png) no-repeat',
                                    'background-size': '100% 100%'
                                });
                            }
                            //用户名
                            $('.user-username-show').html(pangu.myData.username);
                            //等级
                            if(pangu.myParam.site && pangu.myParam.site.switch_grade==1){
                                $('.grade-info').show();
                                $('.user-gradename-show').html(pangu.myData.grade_name);
                            }else{
                                $('.grade-info').hide();
                            }

                            //显示签到状态
                            signInStatusIndex();

                            //积分显示
                            $('.user-point-show').html(pangu.myData.points);

                            //账户安全-手机
                            if (!!pangu.myData.mobile) {
                                $('.user-safe-state1').html('<i class="icon-mobile"></i><i class="icon-check-fill2"></i>');
                            } else {
                                $('.user-safe-state1').html('<i class="icon-mobile"></i></i>');
                            }
                            //账户安全-邮箱
                            if (!!pangu.myData.email) {
                                $('.user-safe-state2').html('<i class="icon-email2"></i><i class="icon-check-fill2"></i>');
                            } else {
                                $('.user-safe-state2').html('<i class="icon-email2"></i></i>');
                            }
                            //账户安全-实名认证
                            if (!!pangu.myData.realname) {
                                $('.user-safe-state3').html('<i class="icon-userinfo2"></i><i class="icon-check-fill2"></i>');
                            } else {
                                $('.user-safe-state3').html('<i class="icon-userinfo2"></i></i>');
                            }
                            //账户安全-密保问题
                            if (!!pangu.myData.bind_safe_question) {
                                $('.user-safe-state4').html('<i class="icon-lock"></i><i class="icon-check-fill2"></i>');
                            } else {
                                $('.user-safe-state4').html('<i class="icon-lock"></i></i>');
                            }

                        });
                    } else if (rightBarTitle == '红利' || rightBarTitle == '紅利') {
                        $('.my-bonus').show(10, function () {
                            $(this).addClass('animated bounceInUp');
                            //滚动条
                            var bonusScroll = $('#my-bonus-scroll');
                            var bonusHeight = $(window).height() - 55 - 15 - 15;
                            bonusScroll.css({
                                'height': bonusHeight + 'px'
                            });
                            bonusScroll.mCustomScrollbar();

                        });
                    }
                }
                /*****我的账户*****/
                $('#open-myAccount').click(function () {
                    rightBarOpenFn($('#open-myAccount'));
                });
                //签到
                $('.right-bar-signIn .sign-in-open1').click(function () {
                    signInFnOpen();
                });
                $('.right-bar-signIn .sign-in-open2').click(function () {
                    signInFnOpen();
                });
                //积分查询
                $('#point-detail').click(function () {
                    point.openModal();
                });
                //如果有未申请生日礼金，显示小圆点
                //设置过生日才能申请
                if (pangu.myData.birthday) {
                    if (pangu.myData.apply_birthday_bonus == 1) {
                        //没有申请过
                        //获取当前时间
                        var nowDate = new Date();
                        var nowTime = nowDate.getTime();
                        //设置今年生日
                        var userBir = pangu.myData.birthday.split('-').join('');
                        var birStr = nowDate.getFullYear() + '/' + userBir.slice(4, 6) + '/' + userBir.slice(6, 8);
                        var birDate = new Date(birStr);
                        var birTime = birDate.getTime();
                        //判断是否处于领取有效期
                        if (parseInt(nowTime) >= parseInt(birTime - 7 * 24 * 60 * 60 * 1000) && parseInt(nowTime) <= parseInt(birTime + 8 * 24 * 60 * 60 * 1000)) {
                            $('.birthday-apply-box').show();
                            $('#open-myAccount .tab-item-ico').html('<i class="icon-user"></i><div class="new-message"></div>');
                            var birStart = new Date(parseInt(birTime - 7 * 24 * 60 * 60 * 1000)).toLocaleString().split(' ')[0];
                            var birEnd = new Date(parseInt(birTime + 8 * 24 * 60 * 60 * 1000)).toLocaleString().split(' ')[0];
                            $('.my-account .birthday-date').html(birStart.split('/').join('-') + ' 至 ' + birEnd.split('/').join('-'));
                        }
                    } else {
                        //生请过
                        $('.birthday-apply-box').hide();
                        $('#open-myAccount .tab-item-ico').html('<i class="icon-user"></i>');
                    }
                } else {
                    $('.birthday-apply-box').hide();
                    $('#open-myAccount .tab-item-ico').html('<i class="icon-user"></i>');
                }
                //申请生日礼金
                $('#birthday-money-apply').click(function () {
                    apiRequest.hlBirthdayApply(function (res) {
                        //申请成功
                        myLayer.alertMsg0(res.message, function () {
                            $('.birthday-apply-box').hide();
                            $('#open-myAccount .tab-item-ico').html('<i class="icon-user"></i>');
                        });
                    });
                });

                /*****红利*****/
                $('#open-myBonus').click(function () {
                    rightBarOpenFn($('#open-myBonus'));
                });

                /*****充值*****/
                $('#open-myRecharge').click(function () {
                    localStorage.accountManageLink = 0;
                    window.open('user/account.html');
                });

                /*****消息*****/
                //如果有未读消息，显示小圆点
                apiRequest.newsUnreadNum(function(count){
                    if(count>0){
                        $('#open-myInfo .tab-item-ico').html('<i class="icon-message2"></i><div class="new-message"></div>');
                    }
                });
                $('#open-myInfo').click(function () {
                    window.open('user/news.html');
                });

                //繁简互换
                langChange(rightBar);
                //右侧栏不分登录
                indexCom.rightBarCom();
            }
        });
    },
    /**********新手引导************/
    guild:function() {
        if (pangu.myData.show_beginner_guide == 1) {
            var guideSteps = $('#guide-steps');
            if (guideSteps.length == 0) {
                var guideStepsBox = '<div id="guide-steps"></div>';
                $('body').append(guideStepsBox);
                guideSteps = $('#guide-steps');
            }
            guideSteps.load('quote/view/guide_steps.html', function (responseText, textStatus, XMLHttpRequest) {
                if (textStatus == 'success') {
                    guideSteps.html(responseText);
                    $('.tipbox .tip-close').click(function () {
                        $("#guide-steps").hide();
                        apiRequest.noviceBoot(function (res) {

                        });
                    });
                    $('.tipbox .tip-next').click(function () {
                        var nextIndex = parseInt($(this).attr('data-next'));
                        indexCom.guildStep(nextIndex);
                    });
                    //繁简互换
                    langChange(guideSteps);
                }
            });
        } else {
            $("#guide-steps").hide();
        }
    },
    guildStep:function(next) {
        $(".tipbox").css({"visibility": "hidden", "display": "none"});
        $(".tipbar").hide();
        $("#step" + next).css({"visibility": "visible", "display": "block"});
        $("#tipbar" + (next)).show();
        if (next == 2) {
            $("#searchTip").css("top", "280px");
        } else if (next == 3) {
            $("#searchTip").css({
                "top": "130px",
                "right": "450px"
            });
        }
    },
    /**********页脚************/
    footer:function() {
        var footer = $('.footer');
        footer.load('quote/view/footer.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                footer.html(responseText);
                //跳到about.html
                $('.footer-text li').click(function () {
                    myCookie.set('aboutLink', $(this).index());
                });
                //调到帮助页面
                $('.footer .go-help').click(function () {
                    window.open('help/index.html', '', 'height=800,width=1300,top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
                });
                //调到代理页面
                if (pangu.myParam.site) {
                    $('#go-agent').attr('href',pangu.myParam.site.agent_url+'/model.html');
                }

                //繁简互换
                langChange(footer);
            }
        });
    },
    /**********两侧浮动框************/
    sidePopover:function() {
        var floatPopoverBox = '<div class="float-popover"></div>';
        $('body').append(floatPopoverBox);

        var floatPopover = $('.float-popover');
        floatPopover.load('quote/view/float_popover.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                floatPopover.html(responseText);
                //繁简互换
                langChange(floatPopover);
                //右侧浮动框打开与关闭
                var floatPopoverR = $('.float-popover-r');
                $('.float-popover-close').click(function () {
                    if (floatPopoverR.css('right') == "-90px") {
                        floatPopoverR.animate({'right': '35px'}, 'swing');
                    } else {
                        floatPopoverR.animate({'right': '-90px'}, 'swing');
                    }
                });
                //打开客服
                $('.float-popover-menu .online-service').click(function () {
                    indexCom.custom();
                });
                //调到帮助页面
                $('.float-popover .go-help').click(function () {
                    window.open('help/index.html', '', 'height=800,width=1300,top=0,left=0,toolbar=no,menubar=no,scrollbars=yes,resizable=no,location=no,status=no');
                });
            }
        });
    },
    /**********底部浮动框************/
    footerPopover:function() {
        var footerPopoverBox = '<div class="footer-popover"></div>';
        $('body').append(footerPopoverBox);

        $('.footer-popover').load('quote/view/footer_popover.html', function (responseText, textStatus, XMLHttpRequest) {
            if (textStatus == 'success') {
                $('.footer-popover').html(responseText);
                var footerPopoverBox = $('.footer-popover-box');
                var btnGoRight = $('.button-go-right');
                footerPopoverBox.css('right', '110%');
                btnGoRight.css('left', '-15px');
                //只在首页显示底部浮动框
                if (window.location.href.indexOf('index') != -1 && myCookie.get('footerPopoverShow') != 1) {
                    footerPopoverBox.css('right', '0');
                    btnGoRight.css('left', '-55px');
                    myCookie.set('footerPopoverShow', 1);
                }
                //底部底部浮动框 打开与关闭
                $('#footer-active-close').click(function () {
                    $(this).fadeOut();
                    footerPopoverBox.animate({'right': '110%'}, 800, 'swing', function () {
                        btnGoRight.animate({'left': '-15px'}, 200, 'swing')
                    });
                });
                btnGoRight.click(function () {
                    $(this).animate({'left': '-55px'}, 200, 'swing', function () {
                        footerPopoverBox.animate({'right': '0'}, 800, 'swing');
                        $('#footer-active-close').fadeIn();
                    });
                })
            }
        });
    },

    //登录状态下显示用户信息,右边栏才能打开
    loginStatus:function(){
        if (myCookie.get('pgToken')) {
            //登录
            apiRequest.getUserInfo(function () {
                indexCom.loginAfter();
                indexCom.rightBarAfter();
                //新手引导
                indexCom.guild();
            });
        } else {
            this.loginBefore();
            this.rightBarBefore();
        }
    },
    //客服
    custom:function(){
        //获取客服链接
        if (pangu.myParam.site && pangu.myParam.site.service_url) {
            window.open(pangu.myParam.site.service_url);
        }else{
            apiRequest.getSite(function(){
                if (pangu.myParam.site && pangu.myParam.site.service_url) {
                    window.open(pangu.myParam.site.service_url);
                }
            });
        }
    },

    pageInit:function(){
        this.loginStatus();
        this.nav();
        this.footer();
        //this.footerPopover();
        setTimeout(function () {
            indexCom.sidePopover();
        }, 5000);
    }
};
/***************************首页************************/
var indexPage={
    //首页显示tab切换 游戏平台
    tabGame:function(){
        apiRequest.gameList(function(){
            var platFormLi0 = '',platFormLi1 = '',platFormLi2 = '',platFormLi3 = '';
            var platFormLists0=pangu.myParam.game1;
            var platFormLists1=pangu.myParam.game2;
            var platFormLists2=pangu.myParam.game3;
            var platFormLists3=pangu.myParam.game4;
            /****循环输出页面内容****/
            //体育
            for(var i0 in platFormLists0){
                platFormLi0 += '<li class="openfastTransfer sport-list-li" data-title="'+platFormLists0[i0].name+'" data-id='+platFormLists0[i0].id +'>' +
                    '<i class="icon-'+platFormLists0[i0].image_code+ '"></i><span>'+platFormLists0[i0].name+'</span></li>';
            }
            $('.game-contain .bd>ul').eq(0).find('.game-list-ul').html(platFormLi0);

            //彩票
            for(var i1 in platFormLists1){
                platFormLi3 += '<li class="lottery-href-item" data-index='+i1+'>' +
                    '<i class="icon-'+platFormLists1[i1].image_code+ '"></i><span>'+platFormLists1[i1].name+'</span></li>';
            }
            $('.game-contain .bd>ul').eq(3).find('.game-list-ul').html(platFormLi3);

            //真人
            for(var i2 in platFormLists2){
                platFormLi1 += '<li class="openfastTransfer live-list-li" data-title="'+platFormLists2[i2].name+'" data-id='+platFormLists2[i2].id+'>' +
                    '<i class="icon-'+platFormLists2[i2].image_code+ '"></i><span>'+platFormLists2[i2].name+'</span></li>';
            }
            $('.game-contain .bd>ul').eq(1).find('.game-list-ul').html(platFormLi1);

            //电子
            for(var i3 in platFormLists3){
                platFormLi2 += '<li class="casino-href-item" data-index='+i3+'>' +
                    '<i class="icon-'+platFormLists3[i3].image_code+ '"></i><span>'+platFormLists3[i3].name+'</span></li>';
            }
            $('.game-contain .bd>ul').eq(2).find('.game-list-ul').html(platFormLi2);

            //点击平台进入   体育 真人
            gameInBeforeFn();
            //点击平台进入  彩票 电子 跳转到相应页面
            $('.lottery-href-item').off();
            $('.lottery-href-item').on('click', function () {
                myCookie.set('lotteryIndex', $(this).attr('data-index'));
                window.location.href = 'lottery.html';
            });
            $('.casino-href-item').off();
            $('.casino-href-item').on('click', function () {
                myCookie.set('casinoIndex',$(this).attr('data-index'));
                window.location.href = 'casino.html';
            });
            //tab显示
            jQuery("#tab-slide").slide();
        });
    },
    pageInit:function(){
        indexAd.noticeAd();
        indexAd.noticeScroll();
        this.tabGame();
        //漂浮广告
        floatAd($('.suspended-picture'));
    }
};
/***************************体育页面************************/
function sportPageShow() {
    apiRequest.gameList(function(){
        var sportLists = pangu.myParam.game1;
        var sportBox = $('.main-sport-bg ul');
        //清空体育游戏平台列表
        sportBox.html('');
        var sportLi = '';
        if (sportLists.length > 0) {
            for (var i = 0; i < sportLists.length; i++) {
                sportLi += '<li class="sport-game-'+sportLists[i].image_code+' openfastTransfer" data-title="'+sportLists[i].name+'" data-id='+sportLists[i].id+'></li>';
            }
            sportBox.html(sportLi);
            gameInBeforeFn();
        } else {
            $('.content .main-sport-bg .main-box').html('<h1>平台正在开放中，敬请期待！</h1>');
            $('.main-nav-item2 .sub-nav').css('height', 0);
        }
    });
}
/***************************真人页面************************/
function livePageShow() {
    apiRequest.gameList(function(){
        var liveLists = pangu.myParam.game3;
        var liveBox = $('.live-game .list-right-content ul');
        //清空真人游戏平台列表
        liveBox.html('');
        var liveLi = '';
        if (liveLists.length > 0) {
            for (var i = 0; i < liveLists.length; i++) {
                liveLi += '<li><a href="javascript:void(0)" class="openfastTransfer" data-title="'+liveLists[i].name+'" data-id='+liveLists[i].id+'>' +
                    '<div class="live-game-img live-game-' +liveLists[i].image_code+'"></div>' +
                    '<div class="live-game-name"><h4>'+liveLists[i].name+'</h4><p>真人发牌 视觉盛宴</p></div>' +
                    '<div class="live-game-play"><i class="icon-down2"></i>立即游戏</div></a></li>';
            }
            liveBox.html(liveLi);
            gameInBeforeFn();
        } else {
            $('.content .live-game .list-right-content').html('<h1>平台正在开放中，敬请期待！</h1>');
            $('.main-nav-item3 .sub-nav').css('height', 0);
        }
    });
}
/***************************电子游戏页面************************/
var casino={
    title:'',//平台名称
    id:null,//平台id
    imgCode:'',//平台简称
    pageSize:20,
    pageNum:0,
    jsonLists:[],//平台json数据
    elem:{
        gameUl:$('.casino-games ul')
    },
    //获取游戏平台
    platformList:function(){
        var casinoLists = pangu.myParam.game4;
        var casinoTopBox = $('.casino-tab ul'),
            casinoLeftBox = $('.casino-left-bar ul');
        //清空真人游戏平台列表
        casinoTopBox.html('');
        casinoLeftBox.html('');
        var casinoTopLi = '';
        var casinoLeftLi = '';
        for(var i=0;i<casinoLists.length;i++){
            casinoTopLi += ' <li data-title="'+casinoLists[i].name+'" data-id='+casinoLists[i].id+' data-imgCode='+casinoLists[i].image_code+'>' +
                '<div class="casino-game-ico"><i class="icon-'+casinoLists[i].image_code+'"></i></div>' +
                '<p><a href="javascript:void(0)" class="casino-game-name"> '+casinoLists[i].name+'</a></p></li>';
            casinoLeftLi += ' <li data-title="'+casinoLists[i].name+'" data-id='+casinoLists[i].id+' data-imgCode='+casinoLists[i].image_code+'>' +
                '<span href="javascript:void(0)"><div class="casino-game-ico-small"><i class="icon-'+casinoLists[i].image_code+'"></i>' +
                '<span class="casino-game-name" style="display: none;"> '+casinoLists[i].name+'</span></div></a></li>';
        }
        casinoTopBox.append(casinoTopLi);
        casinoLeftBox.append(casinoLeftLi);
        $('.casino-tab .line-slider').show();
        $('.casino-game-list .casino-games').css('min-height',parseInt($('.casino-left-bar').height()+8)+'px');

        //tab菜单切换
        casino.tab();
        //平台数据查询
        casino.gameListQuery();
    },
    //tab菜单切换
    tab:function(){
        //默认显示哪一个
        this.tabFn(myCookie.get('casinoIndex'));

        //点击上侧Tab菜单
        $('.casino-tab li').click(function(){
            var liIndex1 = $(this).index();
            casino.tabFn(liIndex1,'clicked');
            myCookie.set('casinoIndex',liIndex1);
        });
        //点击左侧Tab菜单
        $('.casino-left-bar li').click(function(){
            var liIndex2 = $(this).index();
            casino.tabFn(liIndex2,'clicked');
            myCookie.set('casinoIndex',liIndex2);
        });
    },
    tabFn:function(liIndex,str){
        if(!liIndex){
            liIndex = 0;
        }
        var lineLeft = parseInt(125*liIndex+10+21*liIndex);
        if(str){
            $('.line-slider').animate({'left':lineLeft+'px'},500,'swing');
        }else{
            $('.line-slider').css('left',lineLeft+'px');
        }
        $('.casino-tab li').eq(liIndex).addClass('casino-tab-active').siblings('.casino-tab li').removeClass('casino-tab-active');
        $('.casino-left-bar li').eq(liIndex).addClass('casino-left-bar-active').siblings('.casino-left-bar li').removeClass('casino-left-bar-active');
        //显示当前平台的内容
        this.title = $('.casino-left-bar li').eq(liIndex).attr('data-title');
        this.id = $('.casino-left-bar li').eq(liIndex).attr('data-id');
        this.imgCode = $('.casino-left-bar li').eq(liIndex).attr('data-imgCode');
        //获取平台数据
        this.elem.gameUl.html('');
        this.pageNum = 0;
        //捕鱼王
        if(casino.title=='捕鱼王'){
            $('.page-box').hide();
            $('.casino-title .casino-title-r').hide();
            $('.casino-title .casino-search').hide();
            casino.elem.gameUl.html('<div class="byw-img-box"><img class="openfastTransfer" data-key="6" data-title='+casino.title+' data-id='+casino.id+' src="../../pub/images/fishKing.png" alt=""></div>');
            //点击游戏 进入
            gameInBeforeFn();
        }else if(casino.imgCode=='gd'){
            $('.page-box').hide();
            casino.elem.gameUl.html('<h1>平台即将上线，敬请期待！</h1>');
        }else{
            //非捕鱼王
            $('.casino-title .casino-title-r').show();
            $('.casino-title .casino-search').show();
            apiRequest.gameCasinoLists(casino.imgCode,function(res){
                casino.jsonLists = res ;
                var casinoGamesLists = casino.jsonLists;
                casino.gameListPage(casinoGamesLists);
            });
        }
    },
    //查询平台游戏
    gameListQuery:function(){
        //点击推荐 最热  最新  全部
        $('#perfect-games').click(function(){
            $('#casino-search-input').val('');
            var casinoGamesLists_perfect = casino.jsonLists.filter(function(arr){
                return arr['perfect']===1;
            });
            casino.gameListPage(casinoGamesLists_perfect);
        });
        $('#host-games').click(function(){
            $('#casino-search-input').val('');
            var casinoGamesLists_hot = casino.jsonLists.filter(function(arr){
                return arr['hot']===1;
            });
            casino.gameListPage(casinoGamesLists_hot);
        });
        $('#new-games').click(function(){
            $('#casino-search-input').val('');
            var casinoGamesLists_new = casino.jsonLists.filter(function(arr){
                return arr['new']===1;
            });
            casino.gameListPage(casinoGamesLists_new);
        });
        $('#all-games').click(function(){
            $('#casino-search-input').val('');
            var casinoGamesLists_all = casino.jsonLists;
            casino.gameListPage(casinoGamesLists_all);
        });
        //查询单个游戏
        $('.casino-search i').click(function(){
            if($('#casino-search-input').val()==''){
                myLayer.alertMsg0('请输入游戏名！');
                return
            }
            var casinoGamesLists_search =  casino.jsonLists.filter(function(arr){
                return arr['game_name_chinese'].indexOf( $('#casino-search-input').val() )> -1;
            });
            casino.gameListPage(casinoGamesLists_search);
        });
    },
    //游戏图片链接(没有显示默认图片)
    imgUrl:function(img_url) {
        if(img_url){
            return 'https://piccdn.apipg.com/public/images/casino/'+casino.imgCode.toUpperCase()+'/'+img_url;
        }else{
            return 'images/casino-game.png'
        }
    },
    //游戏图片img的onerror方法
    imgErr:function(){
        var img=event.srcElement;
        //针对 HB电子游戏 的图片
        if(img.currentSrc.indexOf('_zh-CN')!=-1){
            var newImg_url = img.currentSrc.split('_zh-CN')[0]+'.png';
            img.src= newImg_url;
            img.onerror=null; //控制不要一直跳动
        }

    },
    //显示分页
    gameListPage:function(casinoGamesLists){
        if(casinoGamesLists.length>0){
            var totalCount=casinoGamesLists.length;
            casino.pageNum = Math.ceil(totalCount/casino.pageSize);
            layui.use('laypage', function () {
                var laypage = layui.laypage;
                laypage({
                    cont: 'casino-pagination'
                    , pages:casino.pageNum
                    , jump:function(obj){
                        var curPage = obj.curr;
                        var casinoGamesLi='';
                        if(casino.pageNum==1){
                            for(var i=0;i<totalCount;i++){
                                casinoGamesLi +=' <li class="openfastTransfer" data-key='+casinoGamesLists[i].key_name+' data-title="'+casino.title+'" data-id='+casino.id+'>'+
                                    '<div class="casino-game-item casino-game-item-'+casino.imgCode+'">'+
                                    '<div class="casino-game-img"><img src='+casino.imgUrl(casinoGamesLists[i].img_url)+' onerror="casino.imgErr()"></div>'+
                                    '<div class="casino-game-name"><span>'+casinoGamesLists[i].game_name_chinese+'</span></div>'+
                                    '<div class="casino-game-level"></div>'+
                                    '<div class="casino-game-play"><a href="javascript:void(0)">立即游戏 <i class="icon-right"></i> </a></div>'+
                                    '</div>'+
                                    '</li>'

                            }
                        }else{
                            for (var j = casino.pageSize * (curPage - 1), k = 0; j < totalCount, k < casino.pageSize; j++, k++) {
                                if( j == totalCount){
                                    break;       // 当遍历到最后一条记录时，跳出循环
                                }
                                casinoGamesLi +=' <li class="openfastTransfer" data-key='+casinoGamesLists[j].key_name+' data-title="'+casino.title+'" data-id='+casino.id+'>'+
                                    '<div class="casino-game-item casino-game-item-'+casino.imgCode+'">'+
                                    '<div class="casino-game-img"><img src='+casino.imgUrl(casinoGamesLists[j].img_url)+' onerror="casino.imgErr()"></div>'+
                                    '<div class="casino-game-name"><span>'+casinoGamesLists[j].game_name_chinese+'</span></div>'+
                                    '<div class="casino-game-level"></div>'+
                                    '<div class="casino-game-play"><a href="javascript:void(0)">立即游戏 <i class="icon-right"></i> </a></div>'+
                                    '</div>'+
                                    '</li>'

                            }
                        }
                        casino.elem.gameUl.html(casinoGamesLi);
                        //点击游戏 进入
                        gameInBeforeFn();
                    }
                });
            });
            if(casino.pageNum>1){
                $('.page-box').show();
            }else{
                $('.page-box').hide();
            }
        }else{
            casino.elem.gameUl.html('<h1>暂无记录</h1>');
            $('.page-box').hide();
        }
    },
    //热门游戏推荐
    gameHot:function(){
        apiRequest.gameCasinoHot(function(res){
            if(res.status==1){
                var hotLists = res.data;
                var hotCasinoLi='';
                if(hotLists.length>0){
                    for(var i=0;i<3;i++){
                        hotCasinoLi+=' <li>' +
                            '<div class="game-img"><img src="quote/images/casino-game'+parseInt(i+1)+'.jpg"></div>' +
                            '<div class="game-img-bg">' +
                            '<div class="game-hot-title">'+hotLists[i].game_name_chinese+'</div>' +
                            '<div class="game-hot-start"></div>' +
                            '<div class="game-hot-play">' +
                            '<a href="javascript:void(0)" class="openfastTransfer" data-casino='+hotLists[i].game_name_chinese+' data-key='+hotLists[i].key_name+' data-title='+hotLists[i].game_name+' data-type='+hotLists[i].type+' data-id='+hotLists[i].id+'>立即游戏</a>' +
                            '</div></div>' +
                            '</li>'
                    }
                    $('.casino-hot-game ul.slide-item').html(hotCasinoLi);
                    jQuery("#casino-slide").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true,vis:3,trigger:"click"});

                    //点击游戏 进入
                    gameInBeforeFn();
                }
            }
        });
    },

    //轮播
    slide:function(){
        jQuery("#casino-slideTop").slide({mainCell:".bd ul",autoPage:true,effect:"topLoop",autoPlay:true,trigger:"click"});
        jQuery("#casino-slide").slide({titCell:".hd ul",mainCell:".bd ul",autoPage:true,effect:"leftLoop",autoPlay:true,vis:3,trigger:"click"});
    },
    //左侧tab滚动到一定位置固定
    leftBar:function(){
        $(document).scroll(function () {
            var top = $(document).scrollTop();
            if (top >= 603) {
                $('.casino-left-bar').css({
                    'position': 'fixed',
                    'left':( (parseInt($('body').width())-1170)/2-52 )+'px',
                    'top':'0'
                });
            } else {
                $('.casino-left-bar').css({
                    'position': 'absolute',
                    'left':'-52px',
                    'top':'77px'
                });
            }
        });
    },
    //改变窗口尺寸 左侧tab改变位置
    leftBarResize:function(){
        window.onresize = function(){
            casino.leftBar();
        };
    },

    pageInit:function(){
        apiRequest.gameList(function(){
            casino.platformList();
        });
        this.slide();
        this.leftBar();
        this.leftBarResize();
    }
};
/***************************彩票页面************************/
var lottery = {
    title: '',//平台名称
    id: null,//平台id
    imgCode: '',//平台简称
    elem:{
        gameUl: $('.lottery-game ul')
    },
    //获取游戏平台
    platformList: function () {
        var lotteryLists = pangu.myParam.game2;
        var lotteryTabLi = '';
        for (var i = 0; i < lotteryLists.length; i++) {
            lotteryTabLi += '<div class="content-tab-item" data-title="'+lotteryLists[i].name+'" data-id='+lotteryLists[i].id+' data-imgCode='+lotteryLists[i].image_code+'> ' +
                '<div class="tab-item"> <i class="lottery-icon-'+lotteryLists[i].image_code+'"></i> <span>'+lotteryLists[i].name+'</span> </div><div class="line"></div> </div>'
        }
        $('.lottery-game .content-tab').html(lotteryTabLi);
        //tab切换
        this.tab();
    },
    //tab菜单切换
    tab: function () {
        //默认显示哪一个
        lottery.tabFn(myCookie.get('lotteryIndex'));
        $('.lottery-game .content-tab-item').click(function () {
            var tabIndex = $(this).index();
            myCookie.set('lotteryIndex', tabIndex);
            lottery.tabFn(tabIndex);
        })
    },
    tabFn: function (liIndex) {
        if (!liIndex) {
            liIndex = 0;
        }
        $('.lottery-game .content-tab-item').removeClass('active');
        $('.lottery-game .content-tab-item').eq(liIndex).addClass('active');
        lottery.title = $('.lottery-game .content-tab-item').eq(liIndex).attr('data-title');
        lottery.id = $('.lottery-game .content-tab-item').eq(liIndex).attr('data-id');
        lottery.imgCode = $('.lottery-game .content-tab-item').eq(liIndex).attr('data-imgCode');
        lottery.gameList();
    },
    //显示各平台列表
    gameList: function () {
        lottery.elem.gameUl.html('');
        //彩播（pglk）
        if (lottery.imgCode == 'pglk') {
            /*var lotteryLists = '';
            var lotteryLi = '';
            if (sessionStorage.getItem("pglkLotterys")) {
                lotteryLists = JSON.parse(sessionStorage.getItem("pglkLotterys"));
                //清空真人游戏平台列表
                lottery.elem.gameUl.html('');
                for (var i = 0; i < lotteryLists.length; i++) {
                    if(lotteryLists[i].data.length>0){
                        lotteryLi += '<li>' +
                            '<a class="openfastTransfer-PGLK" href="javascript:void(0)" data-title="'+lottery.title+'" data-id='+lottery.id+' data-code='+lotteryLists[i].data[0].code+'>' +
                            '<div class="lottery-game-img lottery-game-'+lotteryLists[i].data[0].code+'"></div>' +
                            '<div class="lottery-game-name"><h4>'+lotteryLists[i].data[0].name+'</h4>' +
                            '<div class="lottery-game-play">立即游戏</div></div></a>' +
                            '<div class="lottery-game-rule"><a data-href='+lottery.PGLKName(lotteryLists[i].name)+' href="javascript:void(0)">游戏规则</a></div>' +
                            '</li>';
                    }
                }
                lottery.elem.gameUl.html(lotteryLi);
                //进入游戏
                gameInBeforeFn();
            } else {
                apiRequest.gameLotteryLists(function (data) {
                    lotteryLists = data;
                    //清空真人游戏平台列表
                    lottery.elem.gameUl.html('');
                    for (var i = 0; i < lotteryLists.length; i++) {
                        lotteryLi += '<li>' +
                            '<a class="openfastTransfer" href="javascript:void(0)" data-title="'+lottery.title+'" data-id='+lottery.id+' data-key='+lotteryLists[i].code+'>' +
                            '<div class="lottery-game-img lottery-game-'+lotteryLists[i].code+'"></div>' +
                            '<div class="lottery-game-name"><h4>'+lotteryLists[i].name+'</h4>' +
                            '<div class="lottery-game-play">立即游戏</div></div></a>' +
                            '</li>';
                    }
                    lottery.elem.gameUl.html(lotteryLi);
                    //进入游戏
                    gameInBeforeFn();
                });
            }*/
            caiboIn(lottery.elem.gameUl,lottery.id,'',lottery.title);
        } else{
            lottery.elem.gameUl.html('<a class="openfastTransfer lottery-game-'+lottery.imgCode+'" data-title='+lottery.title+' data-id='+lottery.id+'><img src="../../pub/images/lottery-'+lottery.imgCode+'.jpg" alt=""></a>');
            gameInBeforeFn();
        }
    },

    pageInit: function () {
        apiRequest.gameList(function(){
            lottery.platformList();
        });
    }
};
/***************************关于我们页面************************/
var about={
    linkVal:myCookie.get('aboutLink'),
    elem:{
        li:$('.about-left-menu ul li'),
        content:$('.about-box-r .about-content')
    },
    //tab切换
    tab:function(){
        $('.about-left-menu ul li').click(function(){
            var liIndex = $(this).index();
            $(this).addClass('about-left-menu-active').siblings('.about-left-menu li').removeClass('about-left-menu-active');
            $('.about-box-r .about-content').eq(liIndex).show().siblings('.about-content').hide();
        })
    },
    //链接跳转
    linkTab:function(num){
        if(!num){
            num = 0;
        }
        this.elem.li.removeClass('about-left-menu-active');
        this.elem.li.eq(num).addClass('about-left-menu-active');
        this.elem.content.hide();
        this.elem.content.eq(num).show();
    },
    pageInit:function(){
        this.linkTab(this.linkVal);
        this.tab();
    }
};

$(document).ready(function () {
    indexCom.pageInit();
    apiRequest.getSite(function(){
        //头部是否显示注册字段
        if (pangu.myParam.site && pangu.myParam.site.switch_register == 1) {
            $('.login-modal .login-link').show();
            $('.before-login .reg-btn-open').show();
        } else {
            $('.login-modal .login-link').hide();
            $('.before-login .reg-btn-open').hide();
        }
        //右边栏等级信息
        if(pangu.myParam.site && pangu.myParam.site.switch_grade==1){
            $('.grade-info').show();
            $('.user-gradename-show').html(pangu.myData.grade_name);
        }else{
            $('.grade-info').hide();
        }
        //调到代理页面
        if (pangu.myParam.site) {
            $('#go-agent').attr('href',pangu.myParam.site.agent_url+'/model.html');
        }
    });
    //首页
    if (window.location.href.indexOf('html') == -1 || window.location.href.indexOf('index.html') != -1) {
        indexPage.pageInit();
    }
    //体育页面
    if (window.location.href.indexOf('sport') != -1) {
        sportPageShow();
    }
    //真人页面
    if (window.location.href.indexOf('live') != -1) {
        livePageShow();
    }
    //电子游戏页面
    if (window.location.href.indexOf('casino') != -1) {
        casino.pageInit();
    }
    //彩票页面
    if (window.location.href.indexOf('lottery') != -1) {
        lottery.pageInit();
    }
    //优惠活动页面
    if (window.location.href.indexOf('preferential') != -1) {
        //preferential.pageInitNewOpen();
        preferential.pageInitThisOpen();
    }
    //关于我们页面
    if (window.location.href.indexOf('about') != -1) {
        about.pageInit();
    }
});

