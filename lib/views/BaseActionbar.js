import React,{Component} from 'react'
import {View,Text,StyleSheet,Image,TouchableOpacity} from 'react-native';
import {screenWidth} from '../utils/ScreenUtils';

export default class BaseActionbar extends Component{

    constructor(){
        super()
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View style={[actionbarStyle.contaniner,
                         {backgroundColor:this.props.bgColor==null?'#FFF':this.props.bgColor,
                          marginTop:this.props.top}]}>
                {
                    this.props.showIvBack?
                    <TouchableOpacity style={actionbarStyle.backView}  onPress={()=>this.onBack()} >
                        <Image source={require('../imgs/back.png')} style={{width: 23,height: 23}} />
                    </TouchableOpacity> :null
                }

                <Text style={actionbarStyle.tvTitle} numberOfLines={1}>{this.props.title}</Text>

            </View>
        )
    }

    onBack(){
       this.props.p.props.goBack()
    }
}

const actionbarStyle=StyleSheet.create({

    contaniner:{
        alignItems:'center',
        justifyContent:'center',
      //  backgroundColor:'rgb(255,255,255)',
        width:screenWidth,
        height:48,
        flexDirection:'row',
        paddingLeft:10,
        paddingRight:10,
    },

    backView:{
        position:'absolute',
        left:10,
    },

    tvTitle:{
        maxWidth:screenWidth/3,
        color:"rgb(0,0,0)",
        fontSize:17,
        fontWeight: '700',

    }
})
