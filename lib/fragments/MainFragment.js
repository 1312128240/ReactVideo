import React,{Component} from 'react'
import {FlatList, StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView} from 'react-native';
import BaseActionbar from '../views/BaseActionbar';
import {HttpUtils} from '../utils/HttpUtils';
import {screenWidth} from '../utils/ScreenUtils';
import BasePage from '../base/BasePage';
import BannerView from '../views/BannerView';

export default class MainFragment extends BasePage{

    constructor(){
        super()
        this.state={
            dataList:[],
            selectPosition:-1,
        }
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (

            <View style={{flex:1}}>
                {super.render()}

                <BaseActionbar title="首页"/>

                <FlatList
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader()}
                    keyExtractor={(item,index)=>index.toString()}
                    data={this.state.dataList}
                    renderItem={this.renderItem}/>

            </View>
        );
    }

    componentDidMount(): void {
        let maps={'method':'baidu.ting.billboard.billList','type':"1",'size':'20'}
        HttpUtils.getHttpData(maps,(result)=>{
            this.setState({
                dataList:result.song_list,
            })
        },(error)=>{
            alert("异常回调"+error)
        })
    }

    renderItem=({item,index})=>{
        return (
            <TouchableOpacity style={style.itemContainer} onPress={()=>this.onClickItem(item,index)}>
                <Text>{index}</Text>
                <View style={{paddingLeft: 10}}>
                    <Text style={{color:this.state.selectPosition===index?'red':'black',fontWeight:'700',fontSize:16}}>{item.title}</Text>
                    <Text style={{color:'gray'}}>{item.author}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderHeader(){
        let tempPathList=[]
        this.state.dataList.forEach((item,index)=>{
            if(index<=2){
                tempPathList.push(item)
            }
        })

        if(tempPathList.length>0){
            tempPathList.unshift(tempPathList[2])
            tempPathList.push(tempPathList[1])
        }
        return (<BannerView pathList={tempPathList}/>)
    }


    onClickItem(item,index){
        this.startActivity('playMusic',{bean:item})
        this.setState({
            selectPosition:index
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

    bannerCotainer:{
        height: 210,
        backgroundColor: 'rgb(32,42,43)'
    }
})
