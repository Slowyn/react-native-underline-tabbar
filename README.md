# react-native-underline-tabbar
Custom Tabbar for https://github.com/skv-headless/react-native-scrollable-tab-view.
It is based on defaultTabBar but involves some features e.g. scrollable content in tabs.

### Instalation
```npm install react-native-underline-tabbar --save```
Or using Yarn
```yarn add react-native-underline-tabbar```

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
              tabBarUnderlineColor="#53ac49"
              tabBarActiveTextColor="#53ac49"
              renderTabBar={() => <TabBar/>}>
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
|-----------|----------|----------|--------------------------------------------|
| `tabs`       | `{label: string, badge:string, badgeColor?: string}[]` | `required` | It's used to render tabs |
| `underlineColor`       | `string` | `"navy"` | Set a color of underline |
| `tabBarStyle`       | `Object` | `{}` | You can set styles to TabBar container |
| `activeTabTextStyle`       | `Object` | `{}` | You can set styles to text in tabs |
| `activeTabTextStyle`       | `Object` | `{}` | You can set styles to text in tabs |


### TODO

- [ ] Improve documentation and finish documentation

- [ ] Allow to pass custom views to render tabs

- [ ] Add more customization




