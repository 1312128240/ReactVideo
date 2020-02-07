import {Dimensions,DeviceInfo,Platform} from 'react-native'

let screenWidth=Dimensions.get("window").width

let screenHeight=Dimensions.get("window").height

export {screenWidth,screenHeight}


/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
const X_WIDTH = 375;
const X_HEIGHT = 812;
export function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((screenHeight === X_HEIGHT && screenWidth === X_WIDTH) ||
            (screenHeight === X_WIDTH && screenWidth === X_HEIGHT))
    )
}
