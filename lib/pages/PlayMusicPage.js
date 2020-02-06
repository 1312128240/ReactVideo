import React,{Component} from 'react'
import {
    View, Text, StyleSheet, ScrollView, ImageBackground,
    Image, TouchableOpacity, BackHandler, NativeModules,
} from 'react-native';
import Slider from 'react-native-slider'
import BasePage from '../base/BasePage';
import Video from 'react-native-video'
import {millisToMinute,millisToProgress} from '../utils/ConvertUtils'
import {HttpUtils} from '../utils/HttpUtils';
import {screenHeight, screenWidth} from '../utils/ScreenUtils';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import RNFS from 'react-native-fs'
import DiskAnimatedView from '../views/DiskAnimatedView';

export default class PlayMusicPage extends BasePage{

    constructor(props){
        super()
        this.state={
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

    render(): React.ReactElement<*> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {

        return (
            <View>

                <ImageBackground  source={require('../imgs/timg.png')} style={{height:screenHeight}}>

                    {super.render()}

                    <DiskAnimatedView ref={'AnimatedView'} pic={this.state.songInfor.pic_small} paused={this.state.paused}/>

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
            BackHandler.addEventListener('hardwareBackPress',()=>{
               // NativeModules.LiveModule.pushLiveViewController('PlayMusicPage');
                console.log("返回跳转3")
               // this.startActivity('main')
               // this.props.navigation.popToTop()
               // this.props.navigation.goBack()
            });
        }
    }


    componentWillUnmount(): void {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    }


    getMusicInfor(){
        let maps={'songid':this.state.musicLists[this.state.index].song_id,'method':'baidu.ting.song.play'}
        HttpUtils.getHttpData(maps,(result)=>{
            this.setState({
                songInfor:result.songinfo,
                bitrate:result.bitrate,
            },()=>{
                this.getMusicLyric(this.state.songInfor.lrclink,this.state.songInfor.title)
                this.isCollect()
            })
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
                console.log("下载歌词进度--->"+pro)
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
            <View style={{height:180,justifyContent:'space-around',marginBottom:10}}>

                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <TouchableOpacity onPress={()=>this.onChangeCollect()}>
                        <Image source={this.state.collectImage} style={videoStyle.ivControl}/>
                    </TouchableOpacity>

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
