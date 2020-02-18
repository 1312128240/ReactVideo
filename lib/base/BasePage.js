import React,{Component} from 'react'
import {View, StatusBar, Text, TouchableOpacity,
    Image,StyleSheet,BackHandler} from 'react-native';
import {screenWidth} from '../utils/ScreenUtils';
import Orientation from 'react-native-orientation'

export default class BasePage extends Component{

    UNSAFE_componentWillMount(): void {
     //   Orientation.addOrientationListener((orientation)=>this._orientationDidChange(orientation));
        //进入时强制竖屏
        this.setOrientation(true)
        //Android返回键监听
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress',this._onBackPressAndroid);
        }
    }


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>

                <StatusBar barStyle='dark-content' backgroundColor='rgba(0,0,0,0)' translucent={true}/>

                {this.renderToolbar()}

            </View>
        )
    }

    componentWillUnmount(): void {
       // Orientation.removeOrientationListener(this._orientationDidChange);
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this._onBackPressAndroid);
        }
    }

    renderToolbar(){
        if(this.showToolBar(true)){
            return (
                <View style={[pageStyle.contaniner,{backgroundColor:this.setToolbarBgColor('#FFF')}]}>
                    {
                        this.showIvBack()?
                            <TouchableOpacity style={{position:'absolute',left:10,}}  onPress={()=>this.onBackPress()} >
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


    setOrientation(b){
        b?Orientation.lockToPortrait():Orientation.lockToLandscape()
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

    onBackPress(){
        this.props.navigation.goBack()
    }


   // _orientationDidChange=(orientation)=>{
        // this.setState({
        //     landscape:orientation=='LANDSCAPE'?true:false
        // })
   // }



    _onBackPressAndroid=()=>{
        Orientation.getOrientation((err, orientation) => {
             if(orientation=="LANDSCAPE"){
                 this.setOrientation(true)
             }
        });

    }

}

const pageStyle=StyleSheet.create({

    contaniner:{
        alignItems:'center',
        justifyContent:'center',
        width:'100%',
        height:52,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
    },

    tvTitle:{
        maxWidth:'33%',
        color:"rgb(0,0,0)",
        fontSize:17,
        fontWeight: '700',
    }
})
