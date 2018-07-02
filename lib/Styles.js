/**
 * Created by Konstantin Yakushin.
 * react-native-underline-tabbar
 */
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 20,
    paddingBottom: 10,
  },
  scrollContainer: {
    paddingRight: 20,
  },
  tabs: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#d2d2d2',
  },
  badgeBubble: {
    marginTop: 4,
    marginLeft: 5,
    height: 12,
    width: 17,
    borderRadius: 4.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    top: -0.5,
  },
});