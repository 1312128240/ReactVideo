import React,{Component} from 'react'
import {View,StatusBar,Text} from 'react-native'
//  {/*<StatusBar barStyle='dark-content' backgroundColor='rgba(0,0,0,0)' translucent={false}/>*/}
export default class BasePage extends Component{


    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                <StatusBar barStyle='dark-content' backgroundColor='rgb(255,255,255)' translucent={false}/>
            </View>
        )
    }


}
