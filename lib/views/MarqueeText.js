import React,{Component} from 'react'
import {View,Text,Animated,StyleSheet,Easing} from 'react-native'

export default class MarqueeText extends Component{

    constructor(){
        super()
        this.state={
            animated:new Animated.Value(0),
            toValue:1,
        }

        this.marqueeAnimated=()=>Animated.timing(this.state.animated,{
            toValue:1,     // 最终值 为1，这里表示最大旋转 360度
            duration: 3000,
            easing: Easing.linear,
            useNativeDriver:true,
        })
    }

    render(){

        const translate=this.state.animated.interpolate({
            inputRange: [0,0.5,1],
            outputRange:[0,-70,70],
        })

        return (
            <View style={[marqueeStyle.view]}>
                <Animated.Text style={[marqueeStyle.tv,{transform:[{translateX:translate}]}]} numberOfLines={1}>跑马灯</Animated.Text>
            </View>
        )
    }

    _startMarquee(){
        this.state.animated.setValue(0);
        this.marqueeAnimated().start(()=>{
            this._startMarquee()
        })
    }

    _pauseMarquee(){
      //  this.marqueeAnimated().stop()
    }

}

const marqueeStyle=StyleSheet.create({

    view:{
       width:"35%",
       height:51,
       justifyContent:'center',
       alignItems:'center',
      // alignItems:'flex-end',
       backgroundColor:'#fa3314',

    },

    tv:{
        backgroundColor:'#FFF',
        width:"30%",
        fontSize:16,
        fontWeight:'500',

    }
})
