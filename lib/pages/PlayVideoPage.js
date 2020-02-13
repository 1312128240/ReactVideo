import React,{Component} from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity,
    PanResponder,SafeAreaView,ActivityIndicator} from 'react-native'
import BasePage from '../base/BasePage';
import Video from 'react-native-video'
import {screenHeight, screenWidth} from '../utils/ScreenUtils';
import Slider from 'react-native-slider'
import {millisToMinute, millisToProgress} from '../utils/ConvertUtils';
import Orientation from 'react-native-orientation'

export default class PlayVideoPage extends BasePage{


    setTitle(name): * {
        return super.setTitle("精彩视频");
    }

    showIvBack(b): * {
        return super.showIvBack(true);
    }

    showToolBar(b): * {
        return super.showToolBar(!this.state.landscape);
    }

    constructor(){
        super()
        this.state={
            videoData:{brs:{},cover:""},
            playState:0,  //0加载中，1播放中，2缓冲中，3播放异常，4播放完成,5播放暂停
            videoWidth:0,
            videoHeight:0,
            progress:0,
            duration:0,
            currentDuration:0,
            showcontrol:false,
            touchAction:'',
            landscape:false,   //是否横屏
        }

        this.myTimer=()=>setTimeout(()=>{
            if(this.state.touchAction=='end'){
                this.setState({
                    showcontrol:false
                },()=>this.myTimer&&clearTimeout(this.myTimer))
            }else {
                this.myTimer&&clearTimeout(this.myTimer)
            }
        },2500)
    }

    render(){

        let videoUri=this.state.videoData.brs['480']

        return (
            <SafeAreaView style={{flex:1,backgroundColor:'#FFF'}} onLayout = {this._onLayout}>
                {super.render()}

                <View style={{width:this.state.videoWidth, height: this.state.videoHeight, backgroundColor:'#000000'}}>

                    <Video
                        source={{uri:videoUri}}
                        ref="video"
                        style={{width: '100%', height: '100%'}}
                        repeat={this.state.repeat}
                        //rate={this.state.rate}
                        volume={1}
                        resizeMode="stretch"  //contain、stretch、cover
                        paused={this.state.playState==1?false:true}
                        onEnd={() =>this.onPlayEnd()}
                        onBuffer={this.onPlayBuffer}
                        onLoad={data => this.onPlayLoad(data)}
                        onLoadStart={data => this.onPlayLoadStart(data)}
                        onError={error=>this.onPlayError(error)}
                        onProgress={data=>this.onPlayProgress(data)}
                        playInBackground={true}
                        playWhenInactive={true}/>

                    {this._renderBottomLayout()}

                </View>
            </SafeAreaView>
        )
    }

    componentDidMount(): void {
        let url="http://music.163.com/api/mv/detail?id=10883448&type=mp4"
        fetch(url)
            .then((result)=>result.json())
            .then((respone)=>{
                this.setState({
                    videoData:respone.data,
                })
            })
            .catch((error)=>{
               this.setState({
                   playState:3,
               })
          })

    }

    UNSAFE_componentWillMount(): void {

        this.onTouchListener=PanResponder.create({

            //1,申请成为响应者
            onStartShouldSetPanResponder:()=>this.state.playState==0?false:true,
            onMoveShouldSetPanResponder:()=>this.state.playState==0?false:true,

            //行为
            onPanResponderStart:()=>{
                console.log("触摸")
                this.setState({
                    showcontrol:true,
                    touchAction:'start'
                })
            },
            onPanResponderMove:()=>{
                console.log("移动")
                this.setState({
                    showcontrol:true,
                    touchAction:'move'
                })
            },
            onPanResponderEnd:()=>{
                console.log("结束")
                this.setState({
                    touchAction:'end'
                },()=> this.myTimer())
            },
            onPanResponderRelease:()=>{
                console.log("Release")
            }
        })
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillUnmount(): void {
        Orientation.removeOrientationListener(this._orientationDidChange);
    }

    _orientationDidChange=(orientation)=>{
        console.log("监听"+orientation)
        this.setState({
            landscape:orientation=='LANDSCAPE'?true:false
        })
    }

     _orientationDidChange(orientation) {
         console.log("封装监听--->1"+orientation)
         super._orientationDidChange(orientation);
         console.log("封装监听--->2"+orientation)
     }

    _renderBottomLayout=()=>{
        return (
            <View style={{position:'absolute',width:this.state.videoWidth,height:this.state.videoHeight,
                          justifyContent:'center',alignItems:'center',zIndex:999}}
                  {...this.onTouchListener.panHandlers}
             >
                {
                    <View style={[videoStyle.topTitleView,{width:this.state.videoWidth, opacity:this.state.showcontrol&&this.state.landscape?1:0}]}>
                        <TouchableOpacity onPress={()=>this.setOrientation(true)}>
                            <Image source={require('../imgs/back_white.png')} style={{marginLeft:15,marginRight:15}}/>
                        </TouchableOpacity>

                        <Text style={{color:'#FFF',fontSize:16,fontWeight:'500',width:this.state.videoWidth-60}} numberOfLines={2}>{this.state.videoData.desc}</Text>
                    </View>
                }

                {/*暂停按钮*/}
                <View style={{alignItems:'center'}}>

                    <TouchableOpacity onPress={this.onClickPause}>
                        <Image source={this._setPauseImage()}
                               style={{width:48,height:48,opacity:this.state.showcontrol?1:0}}/>
                    </TouchableOpacity>

                    <Text style={{color:'#fa3314',fontSize:15}}>{this._setHint()}</Text>
                </View>

                {/*进度条*/}
                <View style={[videoStyle.slider,{opacity:this.state.showcontrol?1:0, width:this.state.videoWidth}]}>
                    <Text style={{color:'#FFF'}}>{millisToMinute(this.state.currentDuration)}</Text>
                    <Slider style={{flex:1,marginLeft:12,marginRight:12}}
                            thumbImage={require('../imgs/thumb.png')}
                            value={this.state.progress}
                            minimumValue={0}
                            maximumValue={100}
                            onValueChange={this.onValueChange}
                            onSlidingComplete={this.onSlidingComplete}
                            minimumTrackTintColor={"#389FD6"}
                            maximumTrackTintColor={"#BDBDBD"}/>

                    <Text style={{color:'#FFF'}}>{millisToMinute(this.state.duration)}</Text>

                    <TouchableOpacity onPress={this._onChangeScreen}>
                        <Image source={require('../imgs/full_screen.png')} style={{width:25,height:25,marginLeft:12}}/>
                    </TouchableOpacity>

                </View>

                {/*封面图*/}
                {
                    this.state.playState===0?
                    <View style={{position:'absolute',zIndex:-100}}>
                        <Image source={{uri: this.state.videoData.cover}} style={{width:this.state.videoWidth,height:this.state.videoHeight}}/>
                    </View>:null
                }

            </View>
        )
    }

    _setPauseImage=()=>{
        if(this.state.playState==1){
            return require('../imgs/iv_play_white.png')
        }else if(this.state.playState==3){
            return require('../imgs/wrong.png')
        }else {
            return require('../imgs/play_music.png')
        }
    }

    _onChangeScreen=()=>{
       if(this.state.landscape){
           Orientation.lockToPortrait()
       }else {
           Orientation.lockToLandscape()
       }
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
                landscape: true,
            })
        } else {
            this.setState({
                videoWidth: width,
                videoHeight:(width/16)*9,
                landscape: false,
            })
        }
    }

    _setHint=()=>{
        if(this.state.playState===0){
            return "加载中..."
        }else  if(this.state.playState===1){
           // return "播放中..."
        } if(this.state.playState===2){
            return "缓冲加载中..."
        } if(this.state.playState===3){
            return "播放异常..."
        } if(this.state.playState===4){
            return "播放完成..."
        }
    }

    onPlayLoadStart=(data)=>{
        this.setState({
            playState:0,
        },()=> console.log("视频开始播放"+JSON.stringify(data)))
    }

    onPlayLoad=(data)=>{
        this.setState({
            duration:data.duration,
            playState:1,
        },()=>console.log("视频准备播放"+JSON.stringify(data)))
    }

    onPlayBuffer=()=>{
        this.setState({
            playState:2,
        },()=>console.log("视频缓冲中"))
    }

    onPlayError=(error)=>{
        this.setState({
            playState:3,
        },()=>console.log("视频播放异常"+JSON.stringify(error)))
    }

    onPlayEnd=()=>{
        this.setState({
            playState:4,
        })
    }

    onPlayProgress=(data)=>{
        this.setState({
            currentDuration:data.currentTime,
            progress:millisToProgress(data.currentTime/this.state.duration)
        })
    }

    onSlidingComplete=(value)=>{
        this.refs.video.seek((value*this.state.duration)/100)
        this.setState({
            playState:1,
        },()=>{this.myTimer()})
    }

    onValueChange=()=>{
        this.setState({
            showcontrol:true
        })
    }

    onClickPause=()=>{
        //0加载中，1播放中，2缓冲中，3播放异常，4播放完成,5播放暂停
        if(this.state.playState===0){
           // this.setState({playState:5})
        }else if(this.state.playState===1){
            this.setState({playState:5})
        }else  if(this.state.playState===2){
            this.setState({playState:1})
        }else  if(this.state.playState===3){
            this.setState({playState:1})
        }else  if(this.state.playState===4){
            this.refs.video.seek(0)
            this.setState({
                playState:1,
                progress:0
            })
        }else  if(this.state.playState===5){
            this.setState({playState:1})
        }
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

    slider:{
        flexDirection:'row',
        alignItems: 'center',
        paddingLeft:15,
        paddingRight:15,
        position: 'absolute',
        bottom:0,
        height:50,
        backgroundColor:'rgba(0,0,0,0.5)'
    },

    loadview:{
       //  backgroundColor:'#fa3314',
         alignItems:'center',
         position:'absolute',
         alignSelf:'center',
         height:45,
    },

    topTitleView:{
        backgroundColor:'rgba(0,0,0,0.5)',
        height:50,
        position:'absolute',
        top:0,
        flexDirection:'row',
        //justifyContent:'center',
        alignItems:'center'
    }

})
