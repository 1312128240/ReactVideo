import React,{Component} from 'react'
import {
    View, Text, StyleSheet, ScrollView, StatusBar, Animated, Easing,
    ImageBackground, Image, TouchableOpacity, BackHandler, NativeModules,
} from 'react-native';
import Slider from 'react-native-slider'
import BasePage from '../base/BasePage';
import BaseActionbar from '../views/BaseActionbar';
import Video from 'react-native-video'
import {millisToMinute,millisToProgress} from '../utils/ConvertUtils'
import {HttpUtils} from '../utils/HttpUtils';
import {screenHeight, screenWidth} from '../utils/ScreenUtils';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import RNFS from 'react-native-fs'

export default class PlayMusicPage extends BasePage{

    constructor(props){
        super()

        this.state={
            musicLists:props.navigation.state.params.musicLists,
            index:props.navigation.state.params.index,
            diskAnimated:new Animated.Value(0),
            needleAnimated:new Animated.Value(0),
            stringLry:"歌词",
            playModeImage:require("../imgs/circ.png"),
            songInfor:{},
            bitrate:{},
            paused:false,
            repeat:false,
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
            useNativeDriver:true,
        })
       // this.needleStartRotateAnimated

        this.diskRotateAnimated=Animated.timing(this.state.diskAnimated,{
            toValue: 1,     // 最终值 为1，这里表示最大旋转 360度
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver:true,

        })
    }


    render(): React.ReactElement<*> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        return (
            <View>

                <ImageBackground  source={require('../imgs/timg.png')} style={{height:screenHeight}}>

                    <StatusBar barStyle='dark-content' backgroundColor='rgba(0,0,0,0)' translucent={true} />

                    <BaseActionbar title={this.state.songInfor.title} showIvBack={true} bgColor='rbga(0,0,0,0)' top={15}/>

                    {this.renderDiskLayout()}

                    {this.renderLrcLayout()}

                    {this.renderControlLayout()}

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

                </ImageBackground>

            </View>
        )
    }


    componentDidMount(): void {
        this.getMusicInfor()
        this.setPlayMode()

        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    componentWillUnmount(): void {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }

    /**
     * Android手机拦戴返回键
     */
    onBackAndroid = () => {
        console.log("拦截返回")
        NativeModules.LiveModule.pushLiveViewController('PlayMusicPage');
    }

    getMusicInfor(){
        let maps={'songid':this.state.musicLists[this.state.index].song_id,'method':'baidu.ting.song.play'}
        HttpUtils.getHttpData(maps,(result)=>{
            this.setState({
                songInfor:result.songinfo,
                bitrate:result.bitrate,
            },()=> this.getMusicLyric(this.state.songInfor.lrclink,this.state.songInfor.title))
        },()=>{
            alert("获取音乐失败")
        })
    }

    /**
     * 下载歌词
     * @param lycicUrl
     * @param name
     */
    getMusicLyric(lyciclink,name){
        let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath;
      //  const downloadDest = `${dirs}/${name}.txt`;
        let filePath='file://'+ `${dirs}/${name}.txt`;
        RNFS.exists(filePath).then(b=>{
             if(b){
                console.log(name+"歌词已下载")
                this.readLyric(filePath)
             }else {
                console.log(name+"歌词未下载")
                // RNFS.mkdir(filePath).then(result=>{
                //     this.downloadLryci(lyciclink,downloadDest)
                // })
                 this.downloadLryci(lyciclink,filePath)
             }
        })
    }

    /**
     * 下载歌词
     * @param lycicUrl
     * @param name
     */
    downloadLryci(lyciclink,filePath){
        const options = {
            fromUrl: lyciclink,
            toFile: filePath,
            background: true,
            headers:{"Accept-Encoding": "identity"},
            begin: (res) => {
                console.log('begin', res);
                // console.log('contentLength:', (res.contentLength / 1024/1024)+'M');
            },
            progress: (res) => {
                let pro = res.bytesWritten / res.contentLength;
                console.log("最新版下载歌词进度--->"+pro)
            }
        };
        try {
            const ret = RNFS.downloadFile(options);
            ret.promise.then(res => {
                console.log('success', res);
                this.readLyric(filePath)
            }).catch(err => {
                console.log('下载歌词错误', err);
            });
        } catch (e) {
            console.log('下载歌词错误', err);
        }
    }


    /**
     * 读取sd卡上的文件
     * @param lycicUrl
     * @param name
     */
    readLyric(path) {
        return RNFS.readFile(path)
            .then((result) => {
                this.setState({
                    stringLry: result,
                })
            })
            .catch((err) => {
                console.log("读取歌词失败--->"+err.message);
            });
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
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={{textAlign: 'center'}}>{this.state.stringLry}</Text>
                </ScrollView>
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

    _startDiskRotateAnimated() {
        this.state.diskAnimated.setValue(0);
        this.diskRotateAnimated.start(() => this. _startDiskRotateAnimated());
    }

    _pauseDiskRotateAnimated(){
        this.diskRotateAnimated.stop()
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
                index:this.state.index
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
                index:this.state.index
            },()=>this.getMusicInfor())
        })

    }

    setPlayMode(){
        AsyncStorageUtils.get("PlayMode",(result)=>{
            let imagePath=null
            let isRepeat=false
             if(result===null||result==="0"){
                 AsyncStorageUtils.set("PlayMode","0",(error)=>{
                      if(error!=null){
                          alert("保存失败"+error)
                      }
                 })
                 let isRepeat=false
                 imagePath=require('../imgs/circ.png')
             }else if (result==="1") {
                 isRepeat=true
                 imagePath=require('../imgs/single_circ.png')
             }else if (result==="2") {
                 let isRepeat=false
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
