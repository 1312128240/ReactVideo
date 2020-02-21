import {MusicSchema} from './Entity';

/**
 * 没有指定版本时，schemaVersion 默认为0
 * @type {Realm}
 */
const realm = new Realm({schema: [MusicSchema],schemaVersion:4,});

export default class RealmHelper {


    static inster(entity,callback){
        try {
            realm.write(()=>{
                console.log("插入成功")
                realm.create("MusicEntity",entity)
                callback("Ok")
            })
        }catch (e) {
            callback(e.toString())
        }

    }

    /**
     * 根据id删除或者对象删除
     * @param id
     */
    static del(id,succeedCallBack,errorBack){
        try {
            realm.write(() => {
                let object = realm.objects('MusicEntity');
                let entity =object.filtered('songId=='+id);
                realm.delete(entity);
                succeedCallBack()
            })
        }catch (e) {
             errorBack(e.toString())
        }

    }

    static delEntity(entity){
        try {
            realm.write(()=>{
                realm.delete(entity)
            })
        }catch (e) {
            console.log(e)
        }
    }


    /**
     * 更新
     */
    static update(songId,status,startPosition,pgs,callback){
        try {
            realm.write(()=> {
                realm.create('MusicEntity',{songId:songId,downloadStatus:0,startDownloadPosition:0,progress:pgs,}, true)
                callback(`更新进度--->Ok`)
            });
        }catch (e) {
            callback(`更新进度--->${e.toString()}`)
        }
    }


    static updateStatus(songId,status,callback){
        try {
            realm.write(()=> {
                realm.create('MusicEntity',{songId:songId,downloadStatus:status}, true)
                callback("更新状态--->Ok")
            });
        }catch (e) {
            callback(`更新状态--->${e.toString()}`)
        }
    }


    static updateCollect(songId,isCollect,callback){
        try {
            realm.write(()=> {
                realm.create('MusicEntity',{songId:songId,collect:isCollect}, true)
                callback("更新收藏--->Ok")
            });
        }catch (e) {
            callback("更新收藏--->"+e.toString())
        }
    }




    /**
     * 全部查询和根据条件筛选查询
     * @param callback
     */
    static queryAll(callback){
        let object=realm.objects('MusicEntity')
        callback(object)
    }

    static queryId(songId,callback,error){
        try {
            let object=realm.objects('MusicEntity')
            callback(object.filtered('songId=='+songId));
        }catch (e) {
            error(`${songId}--->查询异常`+e.toString())
        }

    }

}
