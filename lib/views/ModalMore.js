import React,{Component} from 'react'
import {View,Text,Modal,TouchableOpacity,StyleSheet} from 'react-native'

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
                        <View>
                            <TouchableOpacity activeOpacity={1} style={modalStyle.item} onPress={this.props.onClick}>
                                <Text>查看视频</Text>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={1} style={modalStyle.item} onPress={this.goDownloadingPage}>
                                <Text>正在下载</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }

    setModalVisible=(b)=>this.setState({modalVisible:b})


    goDownloadingPage=()=>{

        this.setState({
            modalVisible:false
        },()=> this.props.nav.navigate('downloading'))
    }
}

const modalStyle=StyleSheet.create({
     item:{
         height:50,
         width:'100%',
         paddingLeft:10,
         backgroundColor:'#FFF',
         borderBottomWidth:1,
         borderBottomColor:'#F5F5F5',
         justifyContent: 'center',
     },

})
