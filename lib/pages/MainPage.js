import React,{Component} from 'react'
import {View,Text,FlatList,StyleSheet} from 'react-native'
import {screenWidth} from '../utils/ScreenUtils';
import {HttpUtils} from '../utils/HttpUtils';

export default class MainPage extends Component{

    constructor(){
        super()
        this.state={
            dataList:["1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"]
        }
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                <FlatList
                          keyExtractor={(item,index)=>index.toString()}
                          data={this.state.dataList}
                          renderItem={this.renderItem}/>
            </View>
        );
    }

    renderItem=({item,index})=>{
        return (
            <View style={style.itemContainer}>
                <Text>{index}</Text>
                <View style={{paddingLeft: 10}}>
                    <Text style={{color:'red',fontWeight:'700',fontSize:16}}>海阔天空</Text>
                    <Text style={{color:'gray'}}>黄家驹</Text>
                </View>
            </View>
        )
    }

    componentDidMount(): void {
        let maps={'method':'baidu.ting.billboard.billList','type':"1",'size':'10'}
        HttpUtils.getHttpData(maps,(result)=>{
            alert("成功回调--->"+result.song_list[2].title)

            console.log("成功结果"+result.error_code)
        },(error)=>{
            alert("异常回调"+error)
            console.log("错误结果"+error)
        })
    }
}

const style=StyleSheet.create({
    itemContainer:{
        flexDirection:'row',
        alignItems:'center',
        paddingLeft:10,
        paddingRight:10,
        height:66,
        width:screenWidth,
        backgroundColor:'#FFF',
        borderBottomColor:'rgb(120,120,120)',
        borderBottomWidth:0.5
    },

})
