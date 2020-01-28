import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import mainPage from './pages/MainPage'
import wellcome from './pages/WellcomePage'

const navigator=createStackNavigator({
    wellcome:{
        screen:wellcome,
        navigationOptions:{
            header:null
        }
    },

    main:{
        screen:mainPage,
        navigationOptions:{
            header:null
        }
    }
})

export default createAppContainer(navigator)
