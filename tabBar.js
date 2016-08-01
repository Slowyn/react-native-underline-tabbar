'use strict';

import React, { Component, PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Animated,
    ScrollView,
    Dimensions
} from 'react-native';

const screen_width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  tab: {
    justifyContent: 'center',
    marginLeft: 20,
    paddingBottom: 10
  },
  scrollContainer: {
    paddingRight: 20
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
    borderBottomColor: '#d2d2d2'
  },

  badgeBubble: {
    marginTop: 4,
    marginLeft: 5,
    height: 12,
    width: 17,
    borderRadius: 4.5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    top: -0.5
  }
});

class TabBar extends Component {

  static propTypes = {
    goToPage: PropTypes.func,
    activeTab: PropTypes.number,
    tabs: PropTypes.array,
    underlineColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    scrollContainerStyle: PropTypes.object,
    tabStyles: PropTypes.object
  };

  static defaultProps = {
    tabStyles: {}
  };

  state = {
    renderUnderline: false,
    tabScrollValue: 0
  };

  componentWillMount() {
    this.tabState = {}
  }

  componentDidUpdate(prevProps, prevState) {
    const paddingValue = 20;
    if (prevProps.activeTab === this.props.activeTab) return;

    const overscrollValue = 50;
    let curTabLayout = this.tabState[this.props.activeTab];

    if ((curTabLayout.x + curTabLayout.width - this.state.tabScrollValue) > screen_width) {
      let scrollValue = curTabLayout.x + curTabLayout.width - screen_width;
      if (this.props.tabs.length != this.props.activeTab + 1) scrollValue += overscrollValue;
      this.scrollTabs.scrollTo({x: scrollValue + paddingValue, y: 0});
    } else if (curTabLayout.x < this.state.tabScrollValue) {
      if (this.props.activeTab === 0) this.scrollTabs.scrollTo({x: 0, y: 0});
      else this.scrollTabs.scrollTo({x: curTabLayout.x - overscrollValue, y: 0});
    }
  }

  onTabLayout(event, page) {
    var {x, y, width, height} = event.nativeEvent.layout;
    this.tabState[page] = {x: x, y: y, width: width, height: height};
    if (this.props.tabs.length === Object.keys(this.tabState).length) {
      this.setState({renderUnderline: true});
    }
  }

  renderTabOption(tab, page) {
    const {activeTab, tabBadgeColor} = this.props;
    const {label, badge, badgeColor} = tab;
    const isTabActive = activeTab === page;
    const activeTextColor = this.props.activeTextColor || "navy";
    const inactiveTextColor = this.props.inactiveTextColor || "black";
    const textStyle = this.props.tabBarTextStyle || {};
    return (
        <TouchableOpacity style={[styles.tab, this.props.tabStyles.tab]}
                          key={page}
                          onPress={() => this.props.goToPage(page)}
                          onLayout={(event) => this.onTabLayout(event, page)}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[{color: isTabActive ? activeTextColor : inactiveTextColor, fontWeight: isTabActive ? '400' : '400'}, textStyle]}>{label}</Text>
            {badge != null && badge > 0 &&
            <View style={[styles.badgeBubble,
                          this.props.tabStyles.badgeBubble,
                          {backgroundColor: badgeColor || activeTextColor}]}>
              <Text style={[styles.badgeText, this.props.tabStyles.badgeText]}>{badge || 0}</Text>
            </View>}
          </View>
        </TouchableOpacity>
    );
  }

  renderUnderline() {
    var inputRange = Object.keys(this.tabState);
    var outputRangeLeft = [];
    var outputRangeWidth = [];

    for (var k in this.tabState) {
      if (this.tabState.hasOwnProperty(k)) {
        outputRangeLeft.push(this.tabState[k].x);
        outputRangeWidth.push(this.tabState[k].width);
      }
    }

    var left = this.props.scrollValue.interpolate({
      inputRange: inputRange, outputRange: outputRangeLeft
    });

    var width = this.props.scrollValue.interpolate({
      inputRange: inputRange, outputRange: outputRangeWidth
    });

    var tabUnderlineStyle = {
      position: 'absolute',
      backgroundColor: this.props.underlineColor || "navy",
      height: 2,
      bottom: 0
    };

    return <Animated.View style={[tabUnderlineStyle, {left}, {width}]}/>
  }

  render() {
    return (
        <View style={[styles.tabs, {backgroundColor : this.props.backgroundColor}, this.props.style, this.props.tabBarStyle]}>
          <ScrollView horizontal={true}
                      contentContainerStyle={[styles.scrollContainer, this.props.scrollContainerStyle]}
                      showsHorizontalScrollIndicator={false}
                      ref={(node) => this.scrollTabs = node}
                      bounces={false}
                      scrollEventThrottle={16}
                      onScroll={(e) => this.setState({tabScrollValue: e.nativeEvent.contentOffset.x})}>
            {this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
            {this.state.renderUnderline && this.renderUnderline()}
          </ScrollView>
        </View>
    );
  }
}

module.exports = TabBar;