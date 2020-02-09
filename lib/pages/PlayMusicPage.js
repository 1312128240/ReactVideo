import React,{Component} from 'react'
import {
    View, Text, StyleSheet, ScrollView, ImageBackground,
    Image, TouchableOpacity, BackHandler, NativeModules, SafeAreaView, StatusBar,
} from 'react-native';
import {NavigationActions,StackActions} from 'react-navigation'
import Slider from 'react-native-slider'
import BasePage from '../base/BasePage';
import Video from 'react-native-video'
import {millisToMinute,millisToProgress} from '../utils/ConvertUtils'
import {HttpUtils} from '../utils/HttpUtils';
import {screenHeight, screenWidth} from '../utils/ScreenUtils';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import DiskAnimatedView from '../views/DiskAnimatedView';
import DownloadMusicLyricUtils from '../utils/DownloadMusicLyricUtils';
import ModalMore from '../views/ModalMore';

export default class PlayMusicPage extends BasePage{

    constructor(props){
        super()
        this.state={
            downloadLyricUtil:new DownloadMusicLyricUtils(),
            musicLists:props.navigation.state.params.musicLists,
            index:props.navigation.state.params.index,
            stringLry:"歌词",
            playModeImage:require("../imgs/circ.png"),
            collectImage:require("../imgs/collect.png"),

            songInfor:{},
            bitrate:{},
            paused:false,   //暂停
            repeat:false,   //重复播放
            rate:1,         //倍速
            volume:1,       //音量
            currentProgress:0,
            duration:0,
            currentDuration:0,
        }

    }

    setTitle(name): * {
        return super.setTitle(this.state.songInfor.title);
    }

    showIvBack(b): * {
        return super.showIvBack(true);
    }

    setToolbarBgColor(color): * {
        return super.setToolbarBgColor('rgba(0,0,0,0)');
    }

    render(){

        return (
                <View>

                    <ImageBackground  source={require('../imgs/timg.png')} style={{height:screenHeight}}>

                        <SafeAreaView style={{flex:1,backgroundColor:'rgba(0,0,0,0)'}}>

                       {this.renderToolbar()}

                        {this.renderTopyout()}

                        {this.renderBottomLayout()}

                        <ModalMore ref={'ModalMore'} nav={this.props.navigation}/>

                        </SafeAreaView>

                    </ImageBackground>

                    {this.renderVideoView()}
                </View>
        )
    }


   componentDidMount(): void {
        this.getMusicInfor()
        this.setPlayMode()
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress',this.onAndroidBack);
        }
   }


    componentWillUnmount(): void {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onAndroidBack);
        }
    }

    onAndroidBack=()=>{

    }

    getMusicInfor(){
        let maps={'songid':this.state.musicLists[this.state.index].song_id,'method':'baidu.ting.song.play'}
        HttpUtils.getHttpData(maps,(result)=>{
            this.setState({
                songInfor:result.songinfo,
                bitrate:result.bitrate,
            },()=>{
                this.setLyricView()
                this.isCollect()
            })
        },(e)=>{
            alert("获取音乐失败"+e.toString())
        })
    }


    setLyricView(){
        let lyricLink=this.state.songInfor.lrclink
        let name=this.state.songInfor.title
        this.state.downloadLyricUtil.queryMusicLyric(lyricLink,name,(success)=>{
            this.setState({
                stringLry:success
            })
        },(error)=>{
            alert(error)
        })
    }

    renderToolbar=()=>{
        return (
            <View style={videoStyle.toolbarStyle}>
                <Image source={require('../imgs/back.png')} style={videoStyle.toolbarIv}/>
                <ScrollView
                    contentContainerStyle={videoStyle.toolbarScrollStyle}
                   >
                    <Text style={videoStyle.toolbarTvtitle} numberOfLines={1}>{this.state.songInfor.title}</Text>
                </ScrollView>
            </View>
        )
    }

    renderVideoView(){
        return(
            <Video
                source={{uri:this.state.bitrate.file_link}}
                ref="video"
                repeat={this.state.repeat}
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
        )
    }

    renderTopyout(){
        return (
            <View style={videoStyle.lrcLayout}>
                <DiskAnimatedView ref={'AnimatedView'} pic={this.state.songInfor.pic_small} paused={this.state.paused}/>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{textAlign: 'center'}}>{this.state.stringLry}</Text>
                </ScrollView>

            </View>
        )
    }

    showModalMore=()=>{
        this.setState({
            paused:true
        },()=>{
            this.refs.ModalMore.setModalVisible(true)
        })

    }

    renderBottomLayout(){
        return(
            <View style={{height:160,justifyContent:'space-around'}}>

                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <TouchableOpacity onPress={()=>this.onChangeCollect()}>
                        <Image source={this.state.collectImage} style={videoStyle.ivControl}/>
                    </TouchableOpacity>

                    <Image source={require('../imgs/down.png')} style={videoStyle.ivControl}/>
                    <TouchableOpacity onPress={this.showModalMore }>
                        <Image source={require('../imgs/more.png')} style={videoStyle.ivControl}/>
                    </TouchableOpacity>

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

                    <TouchableOpacity onPress={()=>this.onClickPlayMode()}>
                        <Image source={this.state.playModeImage} style={videoStyle.ivControl}/>
                    </TouchableOpacity>


                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.onClickPrevious()}>
                                <Image source={require('../imgs/previous.png')} style={videoStyle.ivControl}/>
                            </TouchableOpacity>

                            <View style={{width:15}}/>
                            <TouchableOpacity onPress={()=>this.onClickPause()}>
                                <Image source={!this.state.paused?require('../imgs/pause.png'):require('../imgs/start.png')}
                                       style={[videoStyle.ivControl,{width:45,height:45}]}/>
                            </TouchableOpacity>

                            <View style={{width:15}}/>
                            <TouchableOpacity onPress={()=>this.onClickNext()}>
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
        this.onClickNext()
    }

    onPlayLoad(data){
        this.refs.AnimatedView._startDiskRotateAnimated()
        if(this.state.paused){
            this.refs.AnimatedView._startNeedleRotateAnimated()
        }
        this.setState({
            duration:data.duration,
            currentDuration:0,
            currentProgress:0,
            paused:false,
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
                this.refs.AnimatedView._startNeedleRotateAnimated()
                this.refs.AnimatedView._startDiskRotateAnimated()
            })
        }else {
            this.setState({
                paused:true,
            },()=>{
                this.refs.AnimatedView._pausedNeedleRotateAnimated()
                this.refs.AnimatedView._pauseDiskRotateAnimated()
            })
        }

    }

    onProgressComplete(vaule){
        let position=(vaule/100.0)*this.state.duration
        this.refs.video.seek(position)
    }

    onClickNext(){
        AsyncStorageUtils.get("PlayMode",(result)=>{
            if(result==="0"||result==="1"){
                if(this.state.index===this.state.musicLists.length-1){
                    this.state.index=0
                }else {
                    this.state.index=this.state.index+1
                }
            }else if (result==="2") {
                //返回10-20的随机数,公式Math.random()*(20-10)+10
                this.state.index=parseInt(Math.random()*(Math.random()*(this.state.musicLists.length-1)))
            }
            this.setState({
                index:this.state.index,
                paused:true
            },()=>this.getMusicInfor())
        })

    }

    onClickPrevious(){
        AsyncStorageUtils.get("PlayMode",(result)=>{
            if(result==="0"||result==="1"){
                if(this.state.index===0){
                    this.state.index=this.state.musicLists.length-1
                }else {
                    this.state.index=this.state.index-1
                }
            }else if (result==="2") {
                //返回10-20的随机数,公式Math.random()*(20-10)+10
                this.state.index=parseInt(Math.random()*(Math.random()*(this.state.musicLists.length-1)))
            }
            this.setState({
                index:this.state.index,
                paused:true
            },()=>this.getMusicInfor())
        })

    }

    setPlayMode(){
        AsyncStorageUtils.get("PlayMode",(result)=>{
            let imagePath=null
            let isRepeat=false
             if(result==null||result==="0"){
                 AsyncStorageUtils.set("PlayMode","0",(error)=>{
                      if(error!=null){
                          alert("保存失败"+error)
                      }
                 })
                 isRepeat=false
                 imagePath=require('../imgs/circ.png')
             }else if (result==="1") {
                 isRepeat=true
                 imagePath=require('../imgs/single_circ.png')
             }else if (result==="2") {
                 isRepeat=false
                 imagePath=require('../imgs/random.png')
             }
             this.setState({
                 playModeImage:imagePath,
                 repeat:isRepeat
             })
        })
    }

    onClickPlayMode(){
        AsyncStorageUtils.get("PlayMode",(result)=>{
            let value="0"
            let imagePath=""
            let isRepeat=false
            if(result==="0"){
                value="1"
                isRepeat=true
                imagePath=require('../imgs/single_circ.png')
            }else if(result==="1"){
                value="2"
                isRepeat=false
                imagePath=require('../imgs/random.png')
            }else if(result==="2"){
                value="0"
                isRepeat=false
                imagePath=require('../imgs/circ.png')
            }
            AsyncStorageUtils.set("PlayMode",value,(error)=>{
                if(error==null){
                    this.setState({
                        playModeImage:imagePath,
                        repeat:isRepeat
                    })
                }else {
                    alert("保存失败")
                }
            })

        })
    }

    isCollect(){
        let key=this.state.songInfor.song_id
        AsyncStorageUtils.get("IsCollect"+key,(result)=>{
            this.setState({
                collectImage:result?require('../imgs/collect_checked.png'):require('../imgs/collect.png')
            })
        })
    }

    onChangeCollect(){
        let key=this.state.songInfor.song_id
        AsyncStorageUtils.get("IsCollect"+key,(result)=>{
            AsyncStorageUtils.set("IsCollect"+key,result?false:true,(a)=>{
                this.setState({
                    collectImage:result?require('../imgs/collect.png'):require('../imgs/collect_checked.png')
                })
            })
        })

    }

}

const videoStyle=StyleSheet.create({

    toolbarStyle:{
      height:58,
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row',
      backgroundColor: 'rgba(255,255,25,0)'
    },

    toolbarIv:{
      width:32,
      height:32,
      position:'absolute',
      left:10
    },

    toolbarScrollStyle:{
       width:200,
       backgroundColor:'#fa3314',
       alignSelf:'center'
    },

    toolbarTvtitle:{
       fontSize: 16,
       width:80,
       backgroundColor:'#000'
    },

    lrcLayout:{
       // backgroundColor:'#Fa3314',
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        paddingTop:5,
        paddingBottom:5
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
