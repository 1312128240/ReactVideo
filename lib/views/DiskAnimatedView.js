import React,{Component} from 'react'
import {View,Animated,Image,ImageBackground,
    StyleSheet,Easing,} from 'react-native';



export default class DiskAnimatedView extends Component{

    constructor(){
        super()
        this.state={
            diskAnimated:new Animated.Value(0),
            needleAnimated:new Animated.Value(0),
            toValue:1,
        }
    }

     needleStartRotateAnimated=()=>Animated.timing(this.state.needleAnimated,{
        toValue:this.state.toValue,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver:true,
      })

      diskRotateAnimated=()=>Animated.timing(this.state.diskAnimated,{
        toValue: 1,     // 最终值 为1，这里表示最大旋转 360度
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver:true,
      })


    render(){
        const needleStartRotate=this.state.needleAnimated.interpolate({
            inputRange: [0,1],
            outputRange:['0deg','-20deg'],
        })

        const diskRotateZ = this.state.diskAnimated.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        })

        return (
            <View style={animatedStyle.diskLayoutStyle}>

                <Animated.View style={[animatedStyle.needImage,{transform:[{rotate:needleStartRotate}]}]}>
                    <Image source={require('../imgs/needle.png')} style={{height:120,width:90}}/>
                </Animated.View>

                <Animated.View style={[animatedStyle.diskImage,{transform:[{rotate:diskRotateZ}]}]}>
                    <ImageBackground source={require('../imgs/disc.png')} style={animatedStyle.diskImage} >
                        <Image source={{uri:this.props.pic}} style={animatedStyle.authorImage}/>
                    </ImageBackground>
                </Animated.View>

            </View>
        )
    }

    _startDiskRotateAnimated(){
        this.state.diskAnimated.setValue(0);
        this.diskRotateAnimated().start(() =>{
            if(!this.props.paused){
                this. _startDiskRotateAnimated()
            }
        });
    }

    _pauseDiskRotateAnimated(){
        this.diskRotateAnimated().stop()
    }

    _startNeedleRotateAnimated(){
        this.setState({
            toValue:0
        },()=>this.needleStartRotateAnimated().start())
    }

    _pausedNeedleRotateAnimated(){
        this.setState({
            toValue:1
        },()=>this.needleStartRotateAnimated().start())
    }


}

const animatedStyle=StyleSheet.create({
    diskLayoutStyle:{
        alignItems: 'center',
        // backgroundColor:'#fa3314',
        height:250
    },
    needImage:{
       // backgroundColor:'#fa3314',
        marginTop:-20,
        marginLeft:20,
        height:125,
        justifyContent:'flex-end',
        width:60,
        zIndex:100
    },

    diskImage:{
        width:200,
        height: 200,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:0,
    },

    authorImage:{
        width: 130,
        height:130,
        borderRadius:90
    },
})
