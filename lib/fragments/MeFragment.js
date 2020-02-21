
import React,{Component} from 'react'
import {View,Text,FlatList,StyleSheet,
    ProgressBarAndroid,Image,TouchableOpacity} from 'react-native';
import BasePage from '../base/BasePage';
import RealmHelper from '../db/RealmHelper';
import DownloadMusicUtils from '../utils/DownloadMusicUtils';
import {ByteToM} from '../utils/ConvertUtils';

export default class MeFragment extends BasePage{

    constructor(){
        super()
        this.state={
            dataList:[]
        }
    }

    setTitle(name): * {
        return super.setTitle("正在下载");
    }



    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                {super.render()}

                 <FlatList
                     style={{marginTop:10}}
                     getItemLayout={(item,index)=>({length:70, offset:70* index, index})}
                     keyExtractor={(item,index)=>index.toString()}
                     data={this.state.dataList}
                     renderItem={this.renderItem}
                 />
            </View>
        )
    }

    componentDidMount(): void {
        this.timer=setInterval(()=>{
            this._getDatas()
        },1000)
    }


    componentWillUnmount(): void {
        super.componentWillUnmount();
        this.timer&&clearInterval(this.timer)
    }


    renderItem=({item,index})=>{
        return (
            <View style={myDownloadStyle.itemContainer}>
                <Image source={require('../imgs/downing.png')} style={{width:25,height: 25}}/>

                <View style={myDownloadStyle.itemView}>
                    <View style={{flexDirection:'row'}}>
                        <Text style={{color:'#000',fontSize:16,fontWeight: '700'}}>{item.title}</Text>
                        <Text style={{color:'#gray',marginLeft:10,fontSize:12}}>创建时间 {item.createDate}</Text>
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <Text>{ByteToM(item.progress*item.size)}/{ByteToM(item.size)}</Text>
                        <ProgressBarAndroid
                            progress={item.progress}
                            indeterminate={false}
                            style={myDownloadStyle.pb}
                            styleAttr='Horizontal'/>
                    </View>
                </View>

                <TouchableOpacity onPress={()=>this. _onClickDel(item)}>
                    <Image source={require('../imgs/delete.png')} style={{width:25,height:25}}/>
                </TouchableOpacity>

            </View>
        )
    }

    _getDatas=()=>{
        RealmHelper.queryAll((result)=>{
            console.log("查询对象"+JSON.stringify(result))
            this.setState({
                dataList:result
            })
        })
    }

    _onClickDel(item){
        //先删除文件夹
        new DownloadMusicUtils().delMusickFile(item.title,(result)=>{
            console.log("文件夹删除-->"+result)
        })
        RealmHelper.del(`"${item.songId}"`,()=>{
            this._getDatas()
        },(e)=>{
            console.log("删除失败"+e)
        })

    }


}

const myDownloadStyle=StyleSheet.create({

    itemContainer:{
        height:70,
        paddingLeft:10,
        paddingRight:10,
        borderBottomWidth:1,
        borderBottomColor:'#F5F5F5',
        //justifyContent:'space-between',
        backgroundColor:'#FFf',
        flexDirection: 'row',
        alignItems:'center'
    },

    itemView:{
      paddingLeft: 15,
      paddingRight: 15,
      flex:1,
      height:50,
      //backgroundColor:'#fa3314',
      justifyContent:'space-between'
    },

    pb:{
        flex:1,
        marginLeft:20,
        marginRight:20
    }
})
