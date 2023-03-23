export default class utils {
    //获取日期
    static getDate() {
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate(); //获取当前日
        var today = year + "-" + getNow(mon) + "-" + getNow(date)
        return today;
    }
    static getTime() {
        var myDate = new Date();
        var h = myDate.getHours();              //获取当前小时数(0-23)
        var m = myDate.getMinutes();          //获取当前分钟数(0-59)
        var s = myDate.getSeconds();
        var now = getNow(h) + ':' + getNow(m) + ":" + getNow(s);
        return now;
    }
    static getAllTime() {
        var myDate = new Date();
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate(); //获取当前日
        var h = myDate.getHours();              //获取当前小时数(0-23)
        var m = myDate.getMinutes();          //获取当前分钟数(0-59)
        var s = myDate.getSeconds();
        var all = year + "-" + getNow(mon) + "-" + getNow(date)+' '+getNow(h) + ':' + getNow(m) + ":" + getNow(s);
        return all;
    }
    static getYYMM() {
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var today = year + "-" + getNow(mon)
        return today;
    }
  
}

function getNow(s) {
    return s < 10 ? '0' + s : s;
}