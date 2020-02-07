import {Dimensions,DeviceInfo,Platform} from 'react-native'

let screenWidth=Dimensions.get("window").width

let screenHeight=Dimensions.get("window").height

export {screenWidth,screenHeight}

//react-native run-ios --simulator 'iPhone 8'

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
let X_WIDTH = 375;
let X_HEIGHT = 812;
export function isIphoneX() {
    return (
        Platform.OS === 'ios' &&
        ((screenHeight === X_HEIGHT && screenWidth === X_WIDTH) ||
            (screenHeight === X_WIDTH && screenWidth === X_HEIGHT))
    )
}


/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
let X11_WIDTH = 414;
let X11_HEIGHT = 896;
export function isIphone11() {
    return (
        Platform.OS === 'ios' &&
        ((screenHeight === X11_HEIGHT && screenWidth === X11_WIDTH) ||
            (screenHeight === X11_WIDTH && screenWidth === X11_HEIGHT))
    )
}