/**
 * Created by Administrator on 2017/5/9.
 */
/*—————————配置全局变量—————————*/
window.pangu = {
    source:{
        apiHost: "http://dev.testpangu.com/app/",  //前台服务器接口地址
        pcLottery:"https://pgvip.apipg.com//#/main/",  //pc彩票外接地址
        pgLive:'http://www.pg.live/', //彩播外接地址
        pgLiveTest:'http://devpgcpcb.testpangu.com/liveFront/' //互动彩票测试地址'
    },
    production: {
        apiHost: "/app/",  //前台服务器接口地址
        pcLottery:"https://pgvip.apipg.com//#/main/",  //pc彩票外接地址
        pgLive:'http://www.pg.live/', //彩播外接地址
        pgLiveTest:'http://devpgcpcb.testpangu.com/liveFront/' //互动彩票测试地址'
    },
    setConfig: function () {
        switch (window.location.host) {
            case "localhost:63342": //本地环境
                this.config = this.source;
                break;
            default:  		         //线上环境
                this.config = this.production;
                break;
        }
    },
    config: {},      //存放全局配置路径
    myData: {},       //存放用户信息
    myParam: {},       //存放全局参数
    webName:'好运来'
};
pangu.setConfig();
/*—————————配置全局变量—————————*/



