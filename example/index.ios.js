/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TabBar from 'react-native-underline-tabbar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const Page = ({ label }) => (
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

Page.propTypes = {
  label: React.PropTypes.string.isRequired,
};

const Example = () => (
  <View style={[styles.container, { paddingTop: 20 }]}>
    <ScrollableTabView
      tabBarUnderlineColor="#53ac49"
      tabBarActiveTextColor="#53ac49"
      renderTabBar={() => <TabBar />}
    >
      {/*
       We have to use tabLabel to pass tab options to TabBar component,
       because ScrollableTabView passing only this prop to tabs.
       */}
      <Page tabLabel={{ label: 'Page #1' }} label="Page #1" />
      <Page
        tabLabel={{ label: 'Page #2 aka Long!', badge: 3 }}
        label="Page #2 aka Long!"
      />
      <Page tabLabel={{ label: 'Page #3' }} label="Page #3" />
      <Page tabLabel={{ label: 'Page #4 aka Page' }} label="Page #4 aka Page" />
      <Page tabLabel={{ label: 'Page #5' }} label="Page #5" />
    </ScrollableTabView>

  </View>
);

AppRegistry.registerComponent('example', () => Example);
