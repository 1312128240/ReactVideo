import React,{Component} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet, StatusBar} from 'react-native';
import {getWidth, screenHeight, screenWidth} from '../utils/ScreenUtils';
import BasePage from '../base/BasePage';


export default class WellcomePage extends BasePage{

    constructor(){
        super()
        this.state={
            num:5
        }
    }

    showToolBar(b): * {
        return super.showToolBar(false);
    }

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                {super.render()}

                <Image source={{uri: "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2807323310,843543518&fm=26&gp=0.jpg"}}
                       style={{width:screenWidth,height:screenHeight}}/>
                <TouchableOpacity onPress={()=>this.jump()} style={style.btn}>
                    <Text style={{color:'rgb(255,255,255)',fontSize:17}}>倒计时{this.state.num}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    jump(){
        this.props.navigation.navigate("main")
    }

    componentDidMount(): void {
        this.timer=setInterval(()=>{
            this.setState({
                num:this.state.num-1
            },()=>{
                if(this.state.num===-1){
                    this.jump()
                }
            })
        },1000)
    }


    UNSAFE_componentWillMount(): void {
        this.timer&& clearInterval(this.timer)
    }
}

const style=StyleSheet.create({

     btn:{
         position:'absolute',
         right: 12,
         top:25,
     },

})
