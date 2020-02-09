import {createAppContainer,createSwitchNavigator,} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import wellcome from './pages/WellcomePage'
import playMusic from './pages/PlayMusicPage'
import playVideo from './pages/PlayVideoPage'
import mainBottomNavigator from './pages/MainPage'


/**
 * 欢迎页面
 *
 */
const splashNavigator=createStackNavigator({
    wellcome:{
        screen:wellcome,
        navigationOptions:{
            headerShown:false
        }
    }
})


const mainNavigator=createStackNavigator({

    main:{
        screen:mainBottomNavigator,
        navigationOptions:{
            headerShown:false
        }
    },

    playMusic:{
        screen:playMusic,
        navigationOptions:{
            headerShown:false
        }
    },

    playVideo:{
        screen:playVideo,
        navigationOptions:{
            headerShown:false
        }
    }

},{
    initialRouteName:"main"
})

//
// const playNavigator=createStackNavigator({
//     playMusic:{
//         screen:playMusic,
//         navigationOptions:{
//             headerShown:false
//         }
//     }
// },{
//     initialRouteName:'playMusic'
// })


/**
 * switchNavigator
 *
 */
const appNavigator=createSwitchNavigator({
     one:splashNavigator,
     two:mainNavigator,
    // three:playNavigator
})


export default createAppContainer(appNavigator)
