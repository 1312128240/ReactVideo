import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import mainPage from './pages/MainPage'
import wellcome from './pages/WellcomePage'



const splashNavigator=createStackNavigator({
    wellcome:{
        screen:wellcome,
        navigationOptions:{
            header:null
        }
    },
})

const mainNavigator=createStackNavigator({

    main:{
        screen:mainPage,
        navigationOptions:{
            header:null
        }
    }
},{
    initialRouteName:"main"
})

const appNavigator=createSwitchNavigator({
     one:splashNavigator,
     two:mainNavigator,
})


export default createAppContainer(appNavigator)
