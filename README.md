# react-native-underline-tabbar
Custom Tabbar for https://github.com/skv-headless/react-native-scrollable-tab-view.
it involves some features e.g. scrollable content in tabs. Animations are build on matrix transformations and fully compatible with `Animated` library.
In new version there was significantly improved behaviour of tabbar.

### Instalation
```
npm install react-native-underline-tabbar --save
Or using Yarn
yarn add react-native-underline-tabbar
```

### Demo
![react-native-underline-tabbar demo](https://raw.githubusercontent.com/Slowyn/react-native-underline-tabbar/master/demo.gif)


### Usage
```javascript
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from "react-native-underline-tabbar";

const Page = ({label}) => (
    <View style={styles.container}>
      <Text style={styles.welcome}>
        {label}
      </Text>
      <Text style={styles.instructions}>
        To get started, edit index.ios.js
      </Text>
      <Text style={styles.instructions}>
        Press Cmd+R to reload,{'\n'}
        Cmd+D or shake for dev menu
      </Text>
    </View>
);

class example extends Component {
  render() {
    return (
        <View style={[styles.container, {paddingTop: 20}]}>
          <ScrollableTabView
              tabBarActiveTextColor="#53ac49"
              renderTabBar={() => <TabBar underlineColor="#53ac49" />}>
            <Page tabLabel={{label: "Page #1"}} label="Page #1"/>
            <Page tabLabel={{label: "Page #2 aka Long!", badge: 3}} label="Page #2 aka Long!"/>
            <Page tabLabel={{label: "Page #3"}} label="Page #3"/>
            <Page tabLabel={{label: "Page #4 aka Page"}} label="Page #4 aka Page"/>
            <Page tabLabel={{label: "Page #5"}} label="Page #5"/>
          </ScrollableTabView>

        </View>
    );
  }
}
```
Notice! In case of using this tabbar we must pass object into tabLabel property. It is needed for setting labels and badges.

### Documentation

| Property | Type | Default | Description |
|-----------|---------------------|----------|--------------------------------------------|
| `tabs`       | `{label: string, badge:string, badgeColor?: string}[]` | `required` | You don't have to pass this prop directly to tabbar. Istead, it's automatically passed from `ScrollableTabView` from `tabLabel` of your page. In defaultTabbar it is used only to pass a label, but we use it to pass there information about badges. Example ```tabLabel={{label: "Page #4", badge: 8, badgeColor: 'violet'}}```|
| `underlineColor`       | `string` | `"navy"` | Set a color for underline |
| `tabBarStyle`       | `Object` | `{}` | You can set styles to TabBar container |
| `activeTabTextStyle`       | `Object` | `{}` | You can set styles to text in tabs while tab is active |
| `tabBarTextStyle`       | `Object` | `{}` | You can set styles to text in tabs |
| `tabBadgeColor`       | `string` | `{}` | Set a common color for all badges. To set badgeColor individually use `badgeColor` in `tab` property |
| `tabMargin`       | `number` | `20` | You can set space between tabs |

Warning: It's better to avoid usage of styles which can change the size of your active tab. E.g. `font-weight`, `font-size`. Underline still work but not as good as you can expect.

### Changelog
- **[1.1.8]**
  + Initial setup now depends on `initialPage` prop.
  + Calculating of interpolations now doesn't apply transformations to underline. It prevents flickering when tab has styles which resize it
  + Better scrolling in case of manual scrolling of TabBar
- [1.1.7]
  + Remove possible unnecessary transformations to underline. It improves behaviour on Android
- [1.1.6]
  + Change hardcoded marginValue on value from props to calculate scroll positions properly
- [1.1.5]
  + Prevent crashing on android devices
- [1.1.4]
  + Calculating of interpolation values happens only when all mandatory views are measured. It prevents incorrect behaviour of tabs scrolling and underline.
  + Now you can set default colour for badges via `tabBadgeColor` prop
  + Now you can set margins between tabs via `tabMargin` prop




### TODO

- [ ] Improve documentation

- [ ] Allow to pass custom views to render tabs

- [ ] Add more customization




