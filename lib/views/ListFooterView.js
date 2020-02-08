import React,{Component} from 'react'
import {View,Text,ActivityIndicator,StyleSheet} from 'react-native'

export default class ListFooterView extends Component{

    render(){
        return (
           this.props.isLoadMore?
            <View style={footerStyle.footerView}>
                <ActivityIndicator/>
                <View style={{width:8}}/>
                <Text>加载中...</Text>
            </View>:null
        )
    }
}

const footerStyle=StyleSheet.create({
    footerView:{
        height:68,
       // backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        borderTopColor:'#F5F5F5',
        borderTopWidth:1,
    }
})
