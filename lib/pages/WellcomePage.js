import React,{Component} from 'react'
import {View,Text,TouchableOpacity} from 'react-native'


export default class WellcomePage extends Component{

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <View>
                <TouchableOpacity onPress={()=>this.jump()}>
                    <Text>
                        欢迎页面
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    jump(){
        this.props.navigation.navigate("main")
    }
}
