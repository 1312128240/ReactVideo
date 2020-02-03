import React,{Component} from 'react'
import {View,Text,StyleSheet,StatusBar,Animated,Easing,
    ImageBackground,Image,Slider,TouchableOpacity} from 'react-native';
import BasePage from '../base/BasePage';
import BaseActionbar from '../views/BaseActionbar';
import Video from 'react-native-video'
import {millisToMinute,millisToProgress} from '../utils/ConvertUtils'
import {HttpUtils} from '../utils/HttpUtils';
import {screenHeight, screenWidth} from '../utils/ScreenUtils';

export default class PlayMusicPage extends BasePage{

    constructor(props){
        super()
       // this.needleStartRotateAnimated=bind
        this.state={
            bean:props.navigation.state.params.bean,
            diskAnimated:new Animated.Value(0),
            needleAnimated:new Animated.Value(0),
            songInfor:{},
            bitrate:{},
            paused:false,
            rate:1,       //倍速
            volume:1,     //音量
            currentProgress:0,
            duration:0,
            currentDuration:0,
            outputRange: ['0deg','-45deg']
        }

        this.needleStartRotateAnimated=Animated.timing(this.state.needleAnimated,{
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver:true
        })
       // this.needleStartRotateAnimated

        this.diskRotateAnimated=Animated.timing(this.state.diskAnimated,{
            toValue: 1,     // 最终值 为1，这里表示最大旋转 360度
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver:true,
        })
    }

    // diskRotateAnimated=()=>Animated.timing(this.state.diskAnimated,{
    //     toValue: 1,     // 最终值 为1，这里表示最大旋转 360度
    //     duration: 8000,
    //     easing: Easing.linear,
    //     useNativeDriver:true,
    // })


    // needleStartRotateAnimated=()=>Animated.timing(this.state.needleAnimated,{
    //     toValue: 1,
    //     duration: 1000,
    //     easing: Easing.linear,
    //     useNativeDriver:true
    // })


    render(): React.ReactElement<*> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        return (
            <View>

                <ImageBackground  source={require('../imgs/timg.png')} style={{height:screenHeight}}>

                    <StatusBar barStyle='dark-content' backgroundColor='rgba(0,0,0,0)' translucent={true} />

                    <BaseActionbar title={this.state.bean.title} showIvBack={true} bgColor='rbga(0,0,0,0)' top={15}/>

                    {this.renderDiskLayout()}

                    {this.renderLrcLayout()}

                    {this.renderControlLayout()}

                    <Video
                        source={{uri:this.state.bitrate.file_link}}
                        ref="video"
                        volume={this.state.volume}
                        rate={this.state.rate}
                        paused={this.state.paused}
                        onEnd={() =>this.onPlayEnd()}
                        onLoad={data => this.onPlayLoad(data)}
                        onError={error=>this.onPlayError(error)}
                        onProgress={data=>this.onPlayProgress(data)}
                        playInBackground={true}
                        playWhenInactive={true}
                    />

                </ImageBackground>

            </View>
        )
    }


    componentDidMount(): void {
        let maps={'songid':this.state.bean.song_id,'method':'baidu.ting.song.play'}
        HttpUtils.getHttpData(maps,(result)=>{
            this.setState({
                songInfor:result.songinfo,
                bitrate:result.bitrate,
            })
        },()=>{
            alert("获取音乐失败")
        })
    }


    renderDiskLayout(){

        const needleStartRotate=this.state.needleAnimated.interpolate({
            inputRange: [0,1],
            outputRange: this.state.outputRange
        })


        const diskRotateZ = this.state.diskAnimated.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        })

        return (
            <View style={videoStyle.diskLayoutStyle}>

                <Animated.View style={[videoStyle.needImage,{transform:[{rotate:needleStartRotate}]}]} >
                   <Image source={require('../imgs/needle.png')} style={videoStyle.needImage}/>
                </Animated.View>

                <Animated.View style={[videoStyle.diskImage,{transform:[{rotate:diskRotateZ}]}]}>
                    <ImageBackground source={require('../imgs/disc.png')} style={videoStyle.diskImage} >
                        <Image source={{uri: this.state.songInfor.pic_small}} style={videoStyle.authorImage}/>
                    </ImageBackground>
                </Animated.View>

            </View>
        )
    }



    renderLrcLayout(){
        return (
            <View style={videoStyle.lrcLayout}>
                <Text>歌词。。。。。</Text>
            </View>
        )
    }


    renderControlLayout(){
        return(
            <View style={{height:180,justifyContent:'space-around'}}>

                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <Image source={require('../imgs/collect.png')} style={videoStyle.ivControl}/>
                    <Image source={require('../imgs/down.png')} style={videoStyle.ivControl}/>
                    <Image source={require('../imgs/more.png')} style={videoStyle.ivControl}/>
                </View>

                <View style={{flexDirection:'row'}}>
                    <Text style={videoStyle.tvTimer}>{millisToMinute(this.state.currentDuration)}</Text>
                      <Slider  style={{flex: 1}}
                               minimumTrackTintColor={'#Fa3314'}
                               maximumTrackTintColor={'#000'}
                               value={this.state.currentProgress}
                               maximumValue={100}
                               step={1}
                               // onValueChange={value => this.onProgressChange(value)}
                               onSlidingComplete={value=>this.onProgressComplete(value)}
                               //thumbImage={require('../imgs/ic_launcher.png')}
                               />
                    <Text style={videoStyle.tvTimer}>{millisToMinute(this.state.duration)}</Text>
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15}}>
                    <Image source={require('../imgs/circ.png')} style={videoStyle.ivControl}/>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity>
                                <Image source={require('../imgs/previous.png')} style={videoStyle.ivControl}/>
                            </TouchableOpacity>

                            <View style={{width:15}}/>
                            <TouchableOpacity onPress={()=>this.onClickPause()}>
                                <Image source={!this.state.paused?require('../imgs/pause.png'):require('../imgs/start.png')}
                                       style={[videoStyle.ivControl,{width:45,height:45}]}/>
                            </TouchableOpacity>

                            <View style={{width:15}}/>
                            <TouchableOpacity>
                                <Image source={require('../imgs/next.png')} style={videoStyle.ivControl}/>
                            </TouchableOpacity>

                        </View>
                    <Image source={require('../imgs/menu.png')} style={videoStyle.ivControl}/>
                </View>
            </View>
        )
    }


    onPlayEnd(){
        console.log("播放完成")
    }

    _startDiskRotateAnimated() {
        this.state.diskAnimated.setValue(0);
        this.diskRotateAnimated.start(() => this. _startDiskRotateAnimated());
    }

    _pauseDiskRotateAnimated(){
        this.diskRotateAnimated().stop()
    }

    _startNeedleRotateAnimated(){
        this.needleStartRotateAnimated.start()
         this.setState({
             outputRange: ['-45deg','0deg']
         })
    }

    _pausedNeedleRotateAnimated(){
        console.log("对象有吗---"+this.needleStartRotateAnimated)
        this.setState({
            outputRange: ['0deg','-45deg']
        })
    }


    onPlayLoad(data){
        this._startDiskRotateAnimated()
        this.setState({
            duration:data.duration
        })
    }



    onPlayProgress(data){
        let progress=millisToProgress(data.currentTime/this.state.duration)
        this.setState({
            currentDuration:data.currentTime,
            currentProgress:progress,
        })
    }

    onPlayError(error){
        alert("播放异常"+error.toString())
    }

    onClickPause(){
        if(this.state.paused){
            this.setState({
                paused:false
            },()=>{
                this._startNeedleRotateAnimated()
                this._startDiskRotateAnimated()
            })
        }else {
            this.setState({
                paused:true,
            },()=>{
                this._pausedNeedleRotateAnimated()
                this._pauseDiskRotateAnimated()
            })
        }

    }

    onProgressComplete(vaule){
        let position=(vaule/100.0)*this.state.duration
        this.refs.video.seek(position)
    }

}

const videoStyle=StyleSheet.create({
    diskLayoutStyle:{
        alignItems: 'center',
       // backgroundColor:'#fa3314',
        height:300
    },
    needImage:{
        marginLeft:15,
        height:120,
        width:90,
        zIndex:100
    },

    diskImage:{
        width:230,
        height: 230,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:0,
    },

    authorImage:{
        width: 140,
        height:140,
        borderRadius:90
    },

    lrcLayout:{
       // backgroundColor:'#Fa3314',
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },


    ivControl:{
        width:28,
        height:28
    },

    tvTimer:{
       marginRight:10,
       marginLeft:10,
       color:'#fff',
    }
})
