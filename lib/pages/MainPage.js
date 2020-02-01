import React,{Component} from 'react'
import {StyleSheet, Image} from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import fragment1 from '../fragments/MainFragment';
import fragment2 from '../fragments/MeFragment';

/*
 首页
 */
const mainBottomNavigator=createBottomTabNavigator({
    tab1:{
        screen:fragment1,
        navigationOptions:{
            title:"首页",
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                return <Image
                    source={require('../imgs/home.png')}
                    style={{width: 24, height: 24, tintColor: tintColor}}
                />
            },
        }
    },
    tab2:{
        screen:fragment2,
        navigationOptions:{
            title:"我的",
            tabBarIcon: ({focused, horizontal, tintColor}) => {
                return <Image
                    source={require('../imgs/me.png')}
                    style={{width: 24, height: 24, tintColor: tintColor}}
                />
               // return  focused? <Image source={require('../imgs/me.png')}/>:
               //           <Image source={require('../imgs/ic_launcher.png')}/>
            },
        }
    }
},{
    initialRouteName:'tab1',
    backBehavior : 'none', // 按 back 键是否跳转到第一个Tab(首页)
     lazy:true,           //默认true,懒加载
    tabBarOptions:{
        activeTintColor:'#389FD6',
        inactiveTintColor:'rgb(0,0,0)',
        showIcon:true,
        style:{
            height:50,
        }

    }

})

const style=StyleSheet.create({
    icon:{
        width:15,
        height:15
    }
})


export default mainBottomNavigator
