
import React,{Component} from 'react'
import {View,Text} from 'react-native';
import BasePage from '../base/BasePage';

export default class MeFragment extends BasePage{

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        console.log("我的页面初始化")
        return (
            <View>
                {super.render()}
                <BaseActionbar title="我的" />
                <Text>我的界面</Text>
            </View>
        )
    }
}
