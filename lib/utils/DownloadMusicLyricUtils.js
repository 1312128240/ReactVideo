import RNFS from 'react-native-fs';


export default class DownloadMusicLyricUtils {

    /**
     * 查询歌词有没有下载过
     * @param lyciclink
     * @param name
     */
    queryMusicLyric(lyciclink,name,succeedCallback,errorCallback){
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath :RNFS.ExternalDirectoryPath;
        let filePath='file://'+ `${dirs}/${name}.txt`;
        RNFS.exists(filePath).then(b=>{
            console.log(name+"文件存在吗--"+b)
            if(b){
                console.log(name+"歌词已下载")
                this.readLyric(filePath,succeedCallback,errorCallback)
            }else {
                console.log(name+"歌词未下载")
                // RNFS.mkdir(filePath).then(result=>{
                //     this.downloadLryci(lyciclink,downloadDest)
                // })

                this.downloadLyric(lyciclink,filePath,succeedCallback,errorCallback)
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

}
