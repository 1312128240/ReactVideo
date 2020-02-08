import React,{Component} from 'react'
import {FlatList, StatusBar, SafeAreaView,StyleSheet, Text, View,
    TouchableOpacity,NativeModules,RefreshControl} from 'react-native';
import {HttpUtils} from '../utils/HttpUtils';
import {screenWidth} from '../utils/ScreenUtils';
import BasePage from '../base/BasePage';
import BannerView from '../views/BannerView';
import ListFooterView from '../views/ListFooterView';
import {NavigationActions, StackActions} from 'react-navigation';

export default class MainFragment extends BasePage{

    constructor(){
        super()
        this.state={
            dataList:[],
            refreshing:false,
            loadmoreing:false,
            selectPosition:-1,
            size:20,
        }
    }

    setTitle(name): * {
        return super.setTitle("首页");
    }

    showIvBack(b): * {
        return super.showIvBack(false);
    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (

            <SafeAreaView style={{flex:1,backgroundColor:'#FFF'}}>

                {super.render()}

                <FlatList
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    refreshing={this.state.refreshing}
                    data={this.state.dataList}
                    renderItem={this.renderItem}
                    keyExtractor={(item,index)=>index.toString()}
                    ListHeaderComponent={this.renderHeader()}
                    ListFooterComponent={<ListFooterView isLoadMore={this.state.loadmoreing}/>}
                    onRefresh={()=>this.getMuisckListData(true)}
                    onEndReached={() =>this.getMuisckListData(false)}
                    onEndReachedThreshold={0.1}
                    />

            </SafeAreaView>


        );
    }

    componentDidMount(): void {
       this.getMuisckListData(true)
    }

    getMuisckListData(isRefresh){
        if(!isRefresh){
            if(this.state.size>=100){
                alert("全部加载完毕")
                return
            }

        }
        this.setState({
            size:isRefresh?20:this.state.size+10,
            refreshing:isRefresh,
            loadmoreing:!isRefresh
        },()=>{
            let maps={'method':'baidu.ting.billboard.billList', 'type':'1', 'size':this.state.size}
            HttpUtils.getHttpData(maps,(result)=>{
                this.setState({
                    dataList:result.song_list,
                    refreshing:false,
                    loadmoreing:false
                })
            },(error)=>{
                this.setState({
                    refreshing:false,
                    loadmoreing:false
                })
                alert("异常回调"+error)
            })

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
        return (
            <View>
                <BannerView pathList={tempPathList} nav={this.props.navigation}/>
            </View>
        )
    }


    onClickItem(item,index){
        this.setState({
            selectPosition:index
        },()=>{
            this.startActivity('playMusic',{musicLists:this.state.dataList,index:this.state.selectPosition})
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
