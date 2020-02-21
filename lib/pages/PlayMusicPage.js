import React,{Component} from 'react'
import {
    View, Text, StyleSheet,ImageBackground,FlatList,
    Image, TouchableOpacity, BackHandler, NativeModules, SafeAreaView, StatusBar,
} from 'react-native';

import Slider from 'react-native-slider'
import BasePage from '../base/BasePage';
import Video from 'react-native-video'
import {DateUtil, millisToMinute} from '../utils/ConvertUtils';
import {HttpUtils} from '../utils/HttpUtils';
import AsyncStorageUtils from '../utils/AsyncStorageUtils';
import DiskAnimatedView from '../views/DiskAnimatedView';
import DownloadMusicUtils from '../utils/DownloadMusicUtils';
import ModalMore from '../views/ModalMore';
import {MusicSchema} from '../db/Entity'
import RealmHelper from '../db/RealmHelper';
import RNFS from 'react-native-fs';


export default class PlayMusicPage extends BasePage{

    constructor(props){
        super()
        this.state={
            downloadUtil:new DownloadMusicUtils(),
            musicLists:props.navigation.state.params.musicLists,
            index:props.navigation.state.params.index,
            ms:[],
            playModeImage:require("../imgs/circ.png"),
            songInfor:{},
            bitrate:{},
            paused:false,   //暂停
            repeat:false,   //重复播放
            rate:1,         //倍速
            volume:1,       //音量

            currentPlayLine:0,
            duration:0,
            currentPlayTime:'00 : 00',
            currentProgress:0,
            isCollect:false,
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

                    <ImageBackground  source={require('../imgs/timg.png')} style={{height:'100%'}}>

                        <SafeAreaView style={{flex:1,backgroundColor:'rgba(0,0,0,0)'}}>

                        {this.renderTopLayout()}

                        {this.renderLyricLayout()}

                        {this.renderBottomLayout()}

                        </SafeAreaView>

                    </ImageBackground>

                    <ModalMore ref={'ModalMore'} nav={this.props.navigation} onClick={this.goVideoPage}/>

                    {this.renderVideoView()}
                </View>
        )
    }


    componentDidMount(): void {
        this.getMusicInfor()
        this.setPlayMode()
    }

    getMusicLyric(){
        let lyricLink=this.state.songInfor.lrclink
        let name=this.state.songInfor.title
        this.state.downloadUtil.queryMusicLyric(lyricLink,name,(success)=>{
            this.setState({
                ms:success.ms
            })
        },(error)=>{
            alert(error)
        })
    }

    getMusicInfor(){
        let maps={'songid':this.state.musicLists[this.state.index].song_id,'method':'baidu.ting.song.play'}
        HttpUtils.getHttpData(maps,(result)=>{
            this.setState({
                songInfor:result.songinfo,
                bitrate:result.bitrate,
            },()=>{
                this.getMusicLyric()
                this.insetRealm()
            })
        },(e)=>{
            alert("获取音乐失败"+e.toString())
        })
    }

    insetRealm(){
        RealmHelper.inster({
            songId:this.state.songInfor.song_id,
            title:this.state.songInfor.title,
            link:this.state.bitrate.file_link,
            size:this.state.bitrate.file_size,
            duration:this.state.bitrate.file_duration,
            author:this.state.songInfor.author,
            downloadStatus:-1,
            extension:this.state.bitrate.file_extension,
            startDownloadPosition:0,
            createDate:DateUtil(),
            collect:false,
            small_pic:this.state.songInfor.pic_small
        },(e)=>{
            if(e.indexOf("existing primary key")===-1){
                console.log("插入数据库成功")
            }else{
                console.log("不能重复添加，数据库已经存在")
            }
            let songId=this.state.songInfor.song_id
            RealmHelper.queryId(`"${songId}"`,(result)=>{
                if(result.length>0){
                    this.setState({
                        isCollect:result[0].collect,
                    })
                }
            },(e)=>{
               console.log("为毛啊"+e)
            })
        })
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
                progressUpdateInterval={1000}
                onProgress={data=>this.onPlayProgress(data)}
                playInBackground={true}
                playWhenInactive={true}
            />
        )
    }

    renderTopLayout(){
        return (
            <View>

                <View style={musicStyle.topActionbar}>

                    <TouchableOpacity  style={{position: 'absolute',left: 10}} onPress={()=>this.onBackPress()}>
                        <Image source={require('../imgs/back.png')} style={{width:22,height:22}}/>
                    </TouchableOpacity>

                    <Text style={{fontSize:16,fontWeight: '500'}}>{this.state.songInfor.title}</Text>
                </View>

                <DiskAnimatedView ref={'AnimatedView'} pic={this.state.songInfor.pic_small} paused={this.state.paused}/>

            </View>

        )
    }


    renderLyricLayout(){
        return (
            <View style={{flex:1}}>
                <FlatList  keyExtractor={(item,index)=>index.toString()}
                           ref={'lv'}
                           data={this.state.ms}
                           pagingEnabled={true}
                           snapToInterval={32}
                           onMomentumScrollEnd={this._onScrollEnd}
                           getItemLayout={(data,index)=>({length:32,offset:32*index,index})}
                           ListHeaderComponent={()=><View style={{height:120}}/>}
                           ListEmptyComponent={()=>{
                              return(
                                  <View style={{height:370,justifyContent:'center',alignItems:'center'}}>
                                        <Text>没有歌词</Text>
                                  </View>
                                    )}}

                           renderItem={({item,index})=>{
                               return (
                                   <View style={{alignItems:'center'}}>
                                       <Text numberOfLines={1} style={{height:32, lineHeight:32, fontSize:16,
                                         color:this.state.currentPlayLine===index?'#F7C777':'#000',
                                       }}>{item.c}</Text>
                                       {/*<Text numberOfLines={1}*/}
                                       {/*      style={{height:32, lineHeight:32, fontSize:16,*/}
                                       {/*          color: this.state.currentPlayLine==parseInt(item.t)?'#fa3314':'#000'}}>*/}
                                       {/*    {item.c}</Text>*/}
                                   </View>
                               )
                           }}
                />
            </View>

        )
    }


    renderBottomLayout(){
        return(
            <View style={{height:150,justifyContent:'space-around'}}>

                <View style={{flexDirection:'row',justifyContent:'space-around'}}>

                    <TouchableOpacity onPress={()=>this.onChangeCollect()}>
                        <Image source={this.state.isCollect?require("../imgs/collect_checked.png"):require("../imgs/collect.png")}
                               style={musicStyle.ivControl}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this._downloadMusicFile}>
                        <Image source={require('../imgs/down.png')} style={musicStyle.ivControl}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={()=>this.refs.ModalMore.setModalVisible(true)}>
                        <Image source={require('../imgs/more.png')} style={musicStyle.ivControl}/>
                    </TouchableOpacity>

                </View>

                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={musicStyle.tvTimer}>{this.state.currentPlayTime}</Text>
                      <Slider  style={{flex: 1}}
                               minimumTrackTintColor={'#Fa3314'}
                               maximumTrackTintColor={'#000'}
                               value={this.state.currentProgress}
                               minimumValue={0}
                               //maximumValue={this.state.ms.length==0?100:this.state.ms.length}
                               maximumValue={100}
                               step={1}
                               // onValueChange={value => this.onProgressChange(value)}
                               onSlidingComplete={value=>this.onSeekBarComplete(value)}
                               //thumbImage={require('../imgs/ic_launcher.png')}
                               />
                    <Text style={musicStyle.tvTimer}>{millisToMinute(this.state.duration)}</Text>
                </View>

                <View style={musicStyle.bottomView}>

                    <TouchableOpacity onPress={()=>this.onClickPlayMode()}>
                        <Image source={this.state.playModeImage} style={musicStyle.ivControl}/>
                    </TouchableOpacity>


                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <TouchableOpacity onPress={()=>this.onClickPrevious()}>
                                <Image source={require('../imgs/previous.png')} style={musicStyle.ivControl}/>
                            </TouchableOpacity>

                            <View style={{width:15}}/>
                            <TouchableOpacity onPress={()=>this.onClickPause()}>
                                <Image source={!this.state.paused?require('../imgs/pause.png'):require('../imgs/start.png')}
                                       style={[musicStyle.ivControl,{width:45,height:45}]}/>
                            </TouchableOpacity>

                            <View style={{width:15}}/>
                            <TouchableOpacity onPress={()=>this.onClickNext()}>
                                <Image source={require('../imgs/next.png')} style={musicStyle.ivControl}/>
                            </TouchableOpacity>

                        </View>
                    <Image source={require('../imgs/menu.png')} style={musicStyle.ivControl}/>
                </View>
            </View>
        )
    }



    _onScrollEnd=(e)=>{
        console.log("滑动停止--->",e.nativeEvent.contentOffset.y)
        let position=Math.round((e.nativeEvent.contentOffset.y)/32)
        this.setState({
            currentPlayLine:position
        })
    }

    /**
     * 下载音乐
     * @private
     */
    _downloadMusicFile=()=>{
        RealmHelper.queryId(`"${this.state.songInfor.song_id}"`,(result)=>{
             if(result.length>0){
                 let status=result[0].downloadStatus
                 if(status===0){
                     alert("正在下载中")
                 }else if(status===1){
                     alert("已经下载完成")
                 }else if(status===2){
                     alert("下载异常")
                 }else if(status===4){
                     alert("暂停中")
                 }
             }else {
                 this.state.downloadUtil.startDownloadMusicFile(
                     this.state.songInfor.song_id,
                     this.state.songInfor.title,
                     this.state.bitrate.file_link,
                 )
             }
        },(e)=>{
            console.log(e)
        })
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
            currentPlayTime:"00 : 00",
            currentProgress:0,
            paused:false,
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

    onSeekBarComplete(vaule){
        let position=(vaule/100)*this.state.duration
        this.refs.video.seek(position)
        this.setState({
            currentProgress:vaule
        })
        if(this.state.ms.length>0){
            let line=parseInt((vaule/100*(this.state.ms.length-1)+0.2))
            this.refs.lv.scrollToIndex({viewPosition: 0,index:line})
            this.setState({
                currentPlayLine:line
            })
        }

    }

    onPlayProgress(data){

        //计算进度
        let rate=data.currentTime/this.state.duration
        let totalTime=millisToMinute(this.state.duration)
        let playTime=millisToMinute(data.currentTime)
        let t1=parseInt(data.currentTime)
        this.state.ms.forEach((item,position)=>{
             //let t2=parseInt(item.t)
             if(t1===parseInt(item.t)){
                 this.refs.lv.scrollToIndex({viewPosition:0,index:position})
                 this.setState({
                     currentPlayLine:position
                 })
                 return
             }
        })

        this.setState({
            currentPlayTime:playTime>totalTime?totalTime:playTime,
            currentProgress:rate*100,
        })
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
                paused:true,
                currentPlayLine:0,
                currentProgress:0,
                currentPlayTime:'00 : 00',
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
                paused:true,
                currentPlayLine:0,
                currentProgress:0,
                currentPlayTime:'00 : 00',
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


    onChangeCollect(){
        let key=this.state.songInfor.song_id
        RealmHelper.queryId(`"${key}"`,(result)=>{
          if(result.length>0){
              this.setState({
                  isCollect:!result[0].collect
              },()=>{
                  //更新数据库
                  RealmHelper.updateCollect(key,this.state.isCollect,(result)=>{
                      console.log(result)
                  })
              })
          }else {
             console.log("没有查询到要更新的对象")
          }
        },(e)=>{
            console.log("查询收藏失败"+e)
        })
    }


    goVideoPage=()=>{
        this.setState({
            paused:true
        },()=>{
            this.startActivity('playVideo')
            this.refs.ModalMore.setModalVisible(false)
            this.refs.AnimatedView._pausedNeedleRotateAnimated()
            this.refs.AnimatedView._pauseDiskRotateAnimated()
        })
    }

}

const musicStyle=StyleSheet.create({

    topActionbar:{
     // backgroundColor:'#Fa3314',
      flexDirection:'row',
      width:'100%',
      height:51,
      alignItems:'center',
      justifyContent:'center',
    },


    ivControl:{
        width:28,
        height:28
    },

    tvTimer:{
       marginRight:12,
       marginLeft:12,
       color:'#fff',
    },

    bottomView:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:15,
        paddingRight:15
    }
})
