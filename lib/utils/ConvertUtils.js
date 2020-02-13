
export default class ConvertUtils {

    static millisecondToMinute=(millisecond)=>{
        return millisecond/60/60
    }
}

export function millisToMinute(duration) {

    let minute=parseInt(duration/60)

    minute=minute>9?parseInt(minute):"0"+minute

    let second=parseInt(duration%60)
    second=second>9?parseInt(second):"0"+second
    return minute+" : "+second
}

export function millisToProgress(duration) {
     return parseInt(duration*100)
}
