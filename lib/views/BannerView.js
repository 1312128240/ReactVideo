import React,{Component} from 'react'
import {View,Image,ScrollView,StyleSheet,PanResponder} from 'react-native';
import {screenWidth} from '../utils/ScreenUtils';

export default class BannerView extends Component{

    constructor(){
        super()
        this.state={
            currentPage:1,
        }
    }

    render(){
        return (
            <View {...this._panResponder.panHandlers}>
                <ScrollView
                 ref={scrollView=>{
                     if(scrollView!=null){
                         scrollView.scrollTo({x:screenWidth*this.state.currentPage,y:0,animated:false})
                     }
                 }}
                 alwaysBounceHorizontal={false}
                 alwaysBounce={false}
                 horizontal={true}
                 pagingEnabled={true}
                 showsHorizontalScrollIndicator={false}
                 onMomentumScrollEnd={(e)=>this.onScrollEnd(e)}
                >
                  {this.reanderItem()}
                </ScrollView>

                <View style={bannerStyle.indicator}>
                    {this.renderIndicator()}
                </View>
            </View>
        )
    }

    UNSAFE_componentWillMount(): void {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            //询问是否要拦截事件，自己接收处理， true 表示拦截。
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            //表示申请成功，
            onPanResponderGrant: (evt, gestureState) => {
                console.log("申请响应者成功")
            },
            //表示申请被拒绝，
            onPanResponderReject:(evt)=>{
                console.log("申请响应者失败")
            },

            //表示手指按下，开始进行触摸行为。
            onPanResponderStart:(evt)=>{
                this._clearTimer()
                console.log("手势---》start")
            },

            //手指触摸屏幕并进行移动，此回调函数触发非常频繁，尽可能不要做过多任务处理。
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}
                console.log("手势---》Move")
            },

            //触摸行为结束，手指弹起离开屏幕。
            onPanResponderEnd:(evt)=>{
                this._startTimer()
                console.log("手势---》End")
            },

            //当手指弹起离开屏幕时，事件行为结束，一次完整的触摸事件结束，并释放当前触摸行为权限，当前组件不再是事件响应者。
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                console.log("手势---》Release")
            },

            //释放响应者权限
            onPanResponderTerminationRequest: (evt, gestureState) =>{
                console.log("手势---》TerminationRequest")
            },

            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
                console.log("手势---》Terminate")
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    }

    componentDidMount(): void {

        this.viewVisible = this.props.nav.addListener('didFocus', (obj)=>{
               this._startTimer()
            }
        )

        this.viewHide = this.props.nav.addListener('didBlur', (obj)=>{
               this._clearTimer()
           }
        )
    }

    _startTimer(){
        console.log("轮播图开启定时")
        this.MyTimer=setInterval(()=>{
            this.state.currentPage=this.state.currentPage+1
            if(this.state.currentPage===this.props.pathList.length-1){
                this.state.currentPage=1
            }
            this.setState({
                currentPage:this.state.currentPage
            })

        },5000)
    }


    _clearTimer(){
        console.log("轮播图消除定时")
        this.MyTimer&&clearInterval(this.MyTimer)
    }


    componentWillUnmount(): void {
        this._clearTimer()
        this.viewVisible.remove()
        this.viewHide.remove()
    }


    reanderItem(){
       let ImageViewList=[]
       this.props.pathList.forEach((item,index)=>{
           ImageViewList.push(
               <View key={index}>
                   <Image source={{uri:item.pic_radio}} style={{height: 210,width:screenWidth}}/>
               </View>
           )
       })
      return ImageViewList
   }

    renderIndicator(){
       let indicatorViewList=[]
       this.props.pathList.forEach((item,index)=>{
            indicatorViewList.push(
               <View key={index}
                     style={[bannerStyle.indicatorView,
                             {backgroundColor:this.state.currentPage===index?'#Fa3314':'#FFF',opacity:this.setVisible(index)}]}/>
            )
        })
        return indicatorViewList
    }

    setVisible(index){
        if(index===0||index===this.props.pathList.length-1){
            return 0
        }
        return 1
    }

    onScrollEnd(e){
        let indicatorPosition=e.nativeEvent.contentOffset.x/screenWidth
        if(indicatorPosition===0){
            this.state.currentPage=3
        }else if(indicatorPosition===this.props.pathList.length-1){
            this.state.currentPage=1
        }else {
            if(this.state.currentPage!==indicatorPosition){
               if(indicatorPosition<this.state.currentPage){
                   this.state.currentPage=this.state.currentPage-1
               }else {
                   this.state.currentPage=this.state.currentPage+1
               }
            }
        }
        this.setState({
           currentPage:this.state.currentPage
        })
    }
}


const bannerStyle=StyleSheet.create({

    indicator:{
        width:screenWidth,
        height:20,
        justifyContent:'center',
        alignItems:'center',
        position:'absolute',
        flexDirection:'row',
        bottom:10,
    },

    indicatorView:{
        borderRadius:90,
        marginLeft:3,
        marginRight:3,
        width: 10,
        height:10
    }
})
