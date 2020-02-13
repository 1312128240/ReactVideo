import React,{Component} from 'react'
import {View,Text,Modal,TouchableOpacity} from 'react-native'

export default class ModalMore extends Component{

    constructor(){
        super()
        this.state={
            modalVisible:false
        }
    }

    render(){
        return (
            <View>
                <Modal
                    animationType="slide"
                    transparent={true}
                   // presentationStyle={'fullScreen'}
                    visible={this.state.modalVisible}
                    onRequestClose={()=>this.setModalVisible(false)}>
                    <TouchableOpacity style={{backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'flex-end',flex:1}}
                                      onPress={()=>this.setModalVisible(false)}>
                        <View style={{backgroundColor:'#fff',height: 55,justifyContent:'center',paddingLeft:10}}>
                            <TouchableOpacity onPress={this.props.onClick}>
                                <Text>查看视频</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }

    setModalVisible=(b)=>this.setState({modalVisible:b})

}

