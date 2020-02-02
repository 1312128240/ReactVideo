import React,{Component} from 'react'
import {View,Text,StyleSheet,StatusBar,ImageBackground,Image,Slider} from 'react-native';
import BasePage from '../base/BasePage';
import BaseActionbar from '../views/BaseActionbar';
import Video from 'react-native-video'

import {HttpUtils} from '../utils/HttpUtils';
import {screenHeight, screenWidth} from '../utils/ScreenUtils';

export default class PlayMusicPage extends BasePage{

    constructor(props){
        super()
        this.state={
            bean:props.navigation.state.params.bean,
            songInfor:{},
            bitrate:{},
            paused:false
        }
    }

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
                        paused={this.state.paused}
                        // onLoad={data => this.setDuration(data)}
                        volume={1.0}
                        // onEnd={() => this.goToPanel(1)}
                        playInBackground={true}
                        // onProgress={e => this.setTime(e)}
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
        return (
            <View style={videoStyle.diskLayoutStyle}>
                <Image source={require('../imgs/needle.png')} style={videoStyle.needImage}/>
                <ImageBackground source={require('../imgs/disc.png')} style={videoStyle.diskImage}>
                    <Image source={{uri: this.state.songInfor.pic_small}} style={videoStyle.authorImage}/>
                </ImageBackground>
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

                <View style={{marginTop:0,marginBottom:0,flexDirection:'row'}}>
                    <Text style={videoStyle.tvTimer}>00:00</Text>
                      <Slider  style={{flex: 1}}
                               minimumTrackTintColor={'#Fa3314'}
                               maximumTrackTintColor={'#000'}
                               value={85}
                               maximumValue={100}
                               step={1}
                               thumbImage={require('../imgs/ic_launcher.png')}
                               onValueChange={value => {}}/>
                    <Text style={videoStyle.tvTimer}>05:10</Text>
                </View>

                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingLeft:15,paddingRight:15}}>
                    <Image source={require('../imgs/circ.png')} style={videoStyle.ivControl}/>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('../imgs/previous.png')} style={videoStyle.ivControl}/>
                            <View style={{width:15}}/>
                            <Image source={require('../imgs/pause.png')} style={[videoStyle.ivControl,{width:45,height:45}]}/>
                            <View style={{width:15}}/>
                            <Image source={require('../imgs/next.png')} style={videoStyle.ivControl}/>
                        </View>
                    <Image source={require('../imgs/menu.png')} style={videoStyle.ivControl}/>
                </View>
            </View>
        )
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
       marginRight:15,
        marginLeft:15,
        color:'#fff',
    }
})
