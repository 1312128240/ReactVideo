
export const MusicSchema = {
    name: 'MusicEntity',
    primaryKey: 'songId',
    properties: {
        songId:'string',
        title:'string',
        link:'string',
        size:{type:'int',default:0},
        duration:{type:'int',default: 0},
        author:{type:'string',default:'不详'},
        downloadStatus:{type:'int',default:'0'}, //-1初始化,0下载中，1下载完成,2下载异常,3下载暂停
        extension:{type:'string',default:'.mp3'},
        startDownloadPosition:{type:'int',default:0},
        progress:{type:'int',default:0},
        createDate:{type:'string',default:'2020-01-01 00:00:00'},
        collect:{type:'bool',default:false},
    }
};




