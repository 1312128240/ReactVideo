import React,{Component} from 'react'
import {View,Image,ScrollView,StyleSheet} from 'react-native';
import {screenWidth} from '../utils/ScreenUtils';

export default class BannerView extends Component{

    constructor(){
        super()
        this.state={
            currentPage:0,
        }
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                <ScrollView
                 horizontal={true}
                 pagingEnabled={true}
                 showsHorizontalScrollIndicator={false}
                 onMomentumScrollEnd={(e)=>this.onScrollEnd(e )}
                >
                  {this.reanderItem()}
                </ScrollView>

                <View style={bannerStyle.indicator}>
                    {this.renderIndicator()}
                </View>
            </View>
        )
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
                     style={[bannerStyle.indicatorView,{backgroundColor:this.state.currentPage===index?'#Fa3314':'#FFF'}]}/>
            )
        })
        return indicatorViewList
   }

   onScrollEnd(e){
        let x=e.nativeEvent.contentOffset.x

        this.setState({
            currentPage:(x/screenWidth)
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
