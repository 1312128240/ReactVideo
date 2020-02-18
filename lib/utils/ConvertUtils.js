

export function millisToMinute(duration) {


    let minute=parseInt((duration/60))

    minute=minute>9?minute:"0"+minute

    //七舍八入
    let second=parseInt((duration%60)+0.2)

    second=second>9?second:"0"+second

    return minute+" : "+second

}


