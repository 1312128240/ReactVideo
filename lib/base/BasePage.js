import React,{Component} from 'react'
import {View,StatusBar,Text} from 'react-native'

export default class BasePage extends Component{


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                <StatusBar barStyle='light-content' backgroundColor='rgba(0,0,0,0)' translucent={true}/>
            </View>
        )
    }


}
