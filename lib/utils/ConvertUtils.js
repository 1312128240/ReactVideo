

export function millisToMinute(duration) {


    let minute=parseInt((duration/60))

    minute=minute>9?minute:"0"+minute

    //七舍八入
    let second=parseInt((duration%60)+0.2)

    second=second>9?second:"0"+second

    return minute+" : "+second
}

export function DateUtil() {
    let myDate=new Date()
    //年
    let y=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
    //月
    let m=myDate.getMonth()>9?myDate.getMonth():"0"+myDate.getMonth(); //获取当前月份(0-11,0代表1月)
    //日
    let d=myDate.getDate()>9?myDate.getDate():"0"+myDate.getDate();        //获取当前日(1-31)
    //时
    let h=myDate.getHours()>9?myDate.getHours():"0"+myDate.getHours();       //获取当前小时数(0-23)
    //分
    let min=myDate.getMinutes()>9?myDate.getMinutes():"0"+myDate.getMinutes();     //获取当前分钟数(0-59)
    //秒
    let s=myDate.getSeconds()>9?myDate.getSeconds():"0"+myDate.getSeconds();     //获取当前秒数(0-59)

    return y+"-"+m+"-"+d+" "+h+":"+min+":"+s
}

export function ByteToM(kb) {
    let result=(kb*1.0/1024/1024).toFixed(2);

    return result+"M"
}
