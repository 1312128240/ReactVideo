import {createAppContainer,createSwitchNavigator,} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import wellcome from './pages/WellcomePage'
import playMusic from './pages/PlayMusicPage'
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
    }
},{
    initialRouteName:"main"
})



/**
 * switchNavigator
 *
 */
const appNavigator=createSwitchNavigator({
     one:splashNavigator,
     two:mainNavigator,
})


export default createAppContainer(appNavigator)
