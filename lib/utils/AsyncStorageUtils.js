//import {AsyncStorage} from 'react-native'
import AsyncStorage from 'react-native-storage'
export default class AsyncStorageUtils {

    /**
     * 获取数据
     */
    static get(key, callback) {
        AsyncStorage.getItem(key, (error, object) => {
            callback(JSON.parse(object),error,);
        })
    }

    /**
     * 保存
     */
    static set(key, value, callback) {
        return AsyncStorage.setItem(key, JSON.stringify(value), callback);
    }

    /**
     * 更新
     */
    static update(key, value) {
        StorageUtil.set(key, value);
    }

    /**
     * 删除
     */
    static delete(key) {
        return AsyncStorage.removeItem(key);
    }

    /**
     * 清除所有Storage
     */
    static clear() {
        AsyncStorage.clear();
    }}
