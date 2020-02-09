import React,{Component} from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity,PanResponder} from 'react-native'
import BasePage from '../base/BasePage';
import Video from 'react-native-video'
import {screenHeight, screenWidth} from '../utils/ScreenUtils';
import Slider from 'react-native-slider'
import {millisToMinute} from '../utils/ConvertUtils';

export default class PlayVideoPage extends BasePage{

    constructor(){
        super()
        this.state={
            paused:false,
            videoWidth:0,
            videoHeight:0,
            progress:0,
            duration:0,
            currentDuration:0,
            controlVisible:false
        }
    }

    setTitle(name): * {
        return super.setTitle("精彩视频");
    }

    showIvBack(b): * {
        return super.showIvBack(true);
    }

    UNSAFE_componentWillMount(): void {

        this.onTouchListener=PanResponder.create({

            //1,申请成为响应者
            onStartShouldSetPanResponder:()=>true,
            onMoveShouldSetPanResponder:()=>true,

            //行为
            onPanResponderStart:()=>{
                console.log("开始触摸")
                if(this.state.controlVisible){
                    clearTimeout(this.myTimer)
                }else {
                    this.setState({controlVisible:true})
                }
            },

            onPanResponderMove:()=>{
                console.log("开始移动")
                if(this.state.controlVisible){
                    clearTimeout(this.myTimer)
                }else {
                    this.setState({controlVisible:true})
                }
            },
            onPanResponderEnd:()=>{
                this.myTimer()
            }
        })
    }

    myTimer=()=>setTimeout(()=>{
        console.log("执行消失---》")
        this.setState({controlVisible:false})
    },2000)


    render(){
        let link="http://vodkgeyttp8.vod.126.net/cloudmusic/486c/core/4a5b/0fc2f731851a7baee7e154c01aa9c1f5.mp4?wsSecret=0ef6ceb3eaf72ee925e5760fe5121253&wsTime=1581256864"
        return (
            <View style={{flex:1}} onLayout = {this._onLayout}>
                {super.render()}

                <View style={{ width: this.state.videoWidth, height: this.state.videoHeight, backgroundColor:'#000000'}}
                      {...this.onTouchListener.panHandlers}>

                    <Video
                        source={{uri:link}}
                        ref="video"
                        style={{width: this.state.videoWidth, height: this.state.videoHeight}}
                        //repeat={this.state.repeat}
                        //rate={this.state.rate}
                        volume={1}
                        paused={this.state.paused}
                        onEnd={() =>this.onPlayEnd()}
                        onLoad={data => this.onPlayLoad(data)}
                        onError={error=>this.onPlayError(error)}
                        onProgress={data=>this.onPlayProgress(data)}
                        playInBackground={true}
                        playWhenInactive={true}/>

                    {this._renderControlLayout()}
                </View>

            </View>
        )
    }

    _renderControlLayout=()=>{
        return (
            <View style={[videoStyle.controlView,{width:this.state.videoWidth,height:this.state.videoHeight,
                opacity:this.state.controlVisible?1:0}]}>

                <Image source={require('../imgs/iv_play_white.png')} style={{width:48,height:48}}/>

                <View style={videoStyle.slider}>
                    <Text style={{color:'#FFF'}}>{millisToMinute(this.state.currentDuration)}</Text>
                    <Slider style={{flex: 1,marginLeft:15,marginRight:15}}
                            thumbImage={require('../imgs/thumb.png')}
                            value={this.state.progress}
                            onSlidingComplete={this.onValueChange}
                            minimumTrackTintColor={"#389FD6"}
                            maximumTrackTintColor={"#BDBDBD"}/>
                    <Text style={{color:'#FFF'}}>{millisToMinute(this.state.duration)}</Text>
                </View>
            </View>
        )

    }

    _onLayout=(event)=>{
        //获取根View的宽高
        let {width, height} = event.nativeEvent.layout;
        console.log('通过onLayout得到的宽度：' + width);
        console.log('通过onLayout得到的高度：' + height);

        // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
        let isLandscape = (width > height);
        if (isLandscape){
            this.setState({
                videoWidth: width,
                videoHeight: height,
                isFullScreen: true,
            })
        } else {
            this.setState({
                videoWidth: width,
                videoHeight:300,
                isFullScreen: false,
            })
        }
      //  Orientation.unlockAllOrientations();
    }

    onPlayLoad=(data)=>{
       console.log("视频准备播放"+data.duration+"___"+millisToMinute(data.duration))
       this.setState({duration:data.duration})
    }

    onPlayError=(error)=>{
        alert("视频播放异常"+error.toString())
    }

    onPlayProgress=(data)=>{
        this.setState({currentDuration:data.currentTime})
    }

    onPlayEnd=()=>{
        console.log("视频播放结束")
    }

    onValueChange=(value)=>{
        this.refs.video.seek(value*this.state.duration)
    }

}

const videoStyle=StyleSheet.create({

    container:{
        width:screenWidth,
        height:300,
        backgroundColor:"#000",
        alignItems:'center',
        justifyContent:'center'
    },

    videoContainer:{
        position: 'absolute',
        top: 50,
        left: 0,
        bottom: 0,
        right: 0,
        width: 1000,
        height: 300
    },

    controlView:{
      justifyContent:'center',
      alignItems:'center',
      position:'absolute',
    },

    slider:{
        flexDirection:'row',
        alignItems: 'center',
        paddingLeft:15,
        paddingRight:15,
        position: 'absolute',
        bottom:0,
        height:50,
        width:screenWidth,
        backgroundColor:'rgba(0,0,0,0.5)'
    }
})
