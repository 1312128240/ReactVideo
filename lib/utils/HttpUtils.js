import Constant from '../base/Constant';

export class HttpUtils {


    static getHttpData(maps,succeedCallback,errorCallback){

        let paramsArray = [];
          //拼接参数
        Object.keys(maps).forEach(key => paramsArray.push(key + '=' + maps[key]))

        let url=Constant.baseUrl+paramsArray.join('&')
        console.log("拼接path2--->"+url)

        fetch(url,{
              method: 'GET',
              headers: {
                  Accept: 'application/json',
                 'Content-Type': 'application/json',
                 "User-Agent":"Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:0.9.4)"
            },
        })
        .then((response) => response.json())
        .then((responseJson) => {
            succeedCallback(responseJson)

        })
        .catch((error) => {
             errorCallback(error)
        });
    }
}
