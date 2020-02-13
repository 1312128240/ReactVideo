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
     * 读取sd卡上的文件
     * @param lycicUrl
     * @param name
     */
    readLyric(path,succeedCallback,errorCallback) {
        return RNFS.readFile(path)
            .then((result) => {
                  succeedCallback(result)
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
