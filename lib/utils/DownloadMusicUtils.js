import RNFS from 'react-native-fs';


export default class DownloadMusicUtils {

    /**
     * 查询歌词有没有下载过
     * @param lyciclink
     * @param name
     */
    queryMusicLyric(lyciclink,name,succeedCallback,errorCallback){
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath :RNFS.ExternalDirectoryPath+"/音乐歌词";
        let musicLyricPath=`${dirs}/${name}.txt`;
        RNFS.exists(musicLyricPath).then(b=>{
            if(b){
                console.log(name+"歌词已下载过了")
                this.readLyric(musicLyricPath,succeedCallback,errorCallback)
            }else {
                console.log(name+"歌词未下载")
                RNFS.exists(dirs).then(b=>{
                    if(!b){
                        console.log(name+"创建歌词根目录")
                        RNFS.mkdir(dirs)
                    }
                    this.downloadLyric(lyciclink,musicLyricPath,succeedCallback,errorCallback)
                })
            }
        })
    }

    /**
     * 下载歌词
     * @param lycicUrl
     * @param name
     */
    downloadLyric(lyciclink,filePath,succeedCallback,errorCallback){
        const options = {
            fromUrl: lyciclink,
            toFile: filePath,
            background: true,
            headers:{"Accept-Encoding": "identity"},
            begin: (res) => {
                console.log('begin', res);
                // console.log('contentLength:', (res.contentLength / 1024/1024)+'M');
            },
            progress: (res) => {
                let pro = res.bytesWritten / res.contentLength;
                console.log("下载歌词进度--->"+pro)
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('下载歌词成功', res);
                this.readLyric(filePath,succeedCallback,errorCallback)
            }).catch(err => {
                errorCallback("throw-->"+err)
            });
        } catch (e) {
            errorCallback("try catch-->"+e)
        }
    }


    /**
     * 解析lrc歌词
     * @param musicLink
     * @param downloadDest
     */
    resolveLyric(lrcContent,succeedCallback){

        var oLRC = {
            // ti: "", //歌曲名
            // ar: "", //演唱者
            // al: "", //专辑名
            // by: "", //歌词制作人
            // offset: 0, //时间补偿值，单位毫秒，用于调整歌词整体位置
            ms: [] //歌词数组{t:时间,c:歌词}
        };

        try {
            let lryAry =lrcContent.split('\n')   //按照换行符切数组
            //循环处理数据
            lryAry.forEach((value,index)=>{
                let v1 = value.replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
                var v2 = v1.substring(v1.indexOf("[") + 1, v1.indexOf("]"));//取[]间的内容
                var v3 = v2.split(":");//分离:前后文字

                if(isNaN(parseInt(v3[0]))){  //isNaN检测是否为非数字
                    //不是数字，可能为空格，
                }else {
                    var arr = v1.match(/\[(\d+:.+?)\]/g);//提取时间字段，可能有多个
                    //从最后出现]的位置截取歌词文本
                    let v4=value.substring(value.lastIndexOf(']')+1,value.length)
                    arr.forEach((value,index)=>{

                        var t = value.substring(1, value.length-1);//取[]间的内容
                        var s = t.split(":");//分离:前后文字

                        oLRC.ms.push({//对象{t:时间,c:歌词}加入ms数组
                            t: (parseFloat(s[0])*60+parseFloat(s[1])).toFixed(3),
                            c: v4
                        });
                    })
                }
            })

            //排序
            oLRC.ms.sort(function (a, b) {//按时间顺序排序
                return a.t-b.t;
            });

        }catch (e) {
            console.log("歌词解析失败",e)
        }

        succeedCallback(oLRC)

    }

    /**
     * 读取sd卡上的文件
     * @param lycicUrl
     * @param name
     */
    readLyric(path,succeedCallback,errorCallback) {
        return RNFS.readFile(path)
            .then((result) => {
                  this.resolveLyric(result,succeedCallback)
            })
            .catch((err) => {
                  errorCallback("读取歌词失败-->"+err)
            });
    }



    /**
     * 下载音乐文件
     */
    startDownloadMusicFile(musicLink, musicName){
        // 文件夹名字
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath :RNFS.ExternalDirectoryPath+"/音乐歌曲";
        //先判断文件夹是否存在
        let downloadDest = `${dirs}/${musicName}.mp3`;
        RNFS.exists(downloadDest).then(b=>{
            if(b){
               console.log(musicName+"---->音乐文件下载过了")
            }else {
                RNFS.exists(dirs).then(b=>{
                     if(!b){
                        console.log("创建音乐文件夹根目录")
                        RNFS.mkdir(dirs)
                     }
                   this.downloadMusicFile(musicLink,downloadDest)
                })
            }
        })

    }





    downloadMusicFile(musicLink,downloadDest){
        const options = {
            fromUrl: musicLink,
            toFile: downloadDest,
            background: true,
            begin: (res) => {
                console.log('begin', res);
                console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
            },
            progress: (res) => {
                let pro = res.bytesWritten / res.contentLength;
                console.log("下载音乐进度"+pro)
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('下载音乐成功', res);
            }).catch(err => {
                console.log('下载音乐错误', err);
            });
        }
        catch (e) {
            console.log("下载音乐异常"+e)
        }
    }
}
