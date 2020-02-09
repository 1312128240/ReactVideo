import React,{Component} from 'react'
import {View, StatusBar, Text, TouchableOpacity, Image,StyleSheet} from 'react-native';
import {screenWidth} from '../utils/ScreenUtils';

export default class BasePage extends Component{


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>

                <StatusBar barStyle='dark-content' backgroundColor='rgba(0,0,0,0)' translucent={true}/>

                {this.renderToolbar()}

            </View>
        )
    }

    renderToolbar(){
        if(this.showToolBar(true)){
            return (
                <View style={[pageStyle.contaniner,{backgroundColor:this.setToolbarBgColor('#FFF')}]}>
                    {
                        this.showIvBack()?
                            <TouchableOpacity style={{position:'absolute',left:10,}}  onPress={()=>this.onBack()} >
                                <Image source={require('../imgs/back.png')} style={{width: 23,height: 23}} />
                            </TouchableOpacity> :null
                    }
                    <Text style={pageStyle.tvTitle} numberOfLines={1}>{this.setTitle()}</Text>
                </View>
            )
        }else {
            return null
        }
    }

    setTitle(name){
        return name
    }

    showIvBack(b){
        return b
    }

    showToolBar(b){
        return b
    }

    setToolbarBgColor(color){
        return color
    }


    /**
     * Push与navigate的区别在于，
     * navigate如果有已经加载的页面，navigate方法将跳转到已经加载的页面，而不会重新创建一个新的页面。
     * push总是会创建一个新的页面，所以一个页面可以被多次创建。--摘自官网
     * @param routeName
     * @param params
     */
    startActivity(routeName,params){
        this.props.navigation.navigate(routeName,params)
    }

    onBack(){
        this.props.navigation.goBack()
    }


}

const pageStyle=StyleSheet.create({

    contaniner:{
        alignItems:'center',
        justifyContent:'center',
        width:screenWidth,
        height:51,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
    },

    tvTitle:{
        maxWidth:screenWidth/3,
        color:"rgb(0,0,0)",
        fontSize:17,
        fontWeight: '700',
    }
})
