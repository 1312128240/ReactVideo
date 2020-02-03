
export default class ConvertUtils {

    static millisecondToMinute=(millisecond)=>{
        return millisecond/60/60
    }
}

export function millisToMinute(duration) {
    let stringTimer=''
    let minute=parseInt(duration/60)
    if(minute<10){
        stringTimer="0"+minute
    }
    let second=parseInt(duration%60)
    if(second<10){
        return stringTimer+" : 0"+second
    }
    return stringTimer+" : "+second
}

export function millisToProgress(duration) {
     return parseInt(duration*100)
}
