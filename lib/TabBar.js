// @flow
/**
 * Created by Konstantin Yakushin.
 * react-native-underline-tabbar
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  Dimensions,
} from 'react-native';

import styles from './Styles';

const SCREEN_WIDTH = Dimensions.get('window').width;


type TabBarProps = {
  goToPage: Function,
  activeTab: number,
  tabs: Array<{ label: string, badge: string, badgeColor?: string }>,
  underlineColor: string,
  backgroundColor: string,
  activeTextColor: string,
  inactiveTextColor: string,
  scrollContainerStyle?: StyleSheet.Styles,
  tabStyles?: StyleSheet.Styles,
};

type TabBarState = {
  renderUnderline: boolean,
  tabScrollValue: number,
};

class TabBar extends Component {
  props: TabBarProps;
  static defaultProps = {
    tabStyles: {},
    scrollContainerStyle: {},
  };
  tabState: Object = {};
  scrollTabs: ?Element = null;
  state: TabBarState = {
    renderUnderline: false,
    tabScrollValue: 0,
  };
  componentDidUpdate(prevProps: TabBarProps) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.checkViewportOverflows();
    }
  }

  checkViewportOverflows() {
    const getScreenMargin = props =>
      StyleSheet.flatten([styles.tab, props.tabStyles.tab]).marginLeft;

    const screenMargin = getScreenMargin(this.props);
    const currentTabLayout = this.tabState[this.props.activeTab];
    const rightOverflow = currentTabLayout.x +
      currentTabLayout.width -
      SCREEN_WIDTH;
    const hasRightViewportOverflow = rightOverflow > this.state.tabScrollValue;
    const hasLeftViewportOverflow = currentTabLayout.x <
      this.state.tabScrollValue;

    if (hasRightViewportOverflow) {
      const isLastTab = this.props.tabs.length === this.props.activeTab + 1;
      const n = isLastTab ? 1 : 2;
      const x = rightOverflow + screenMargin * n;
      const y = 0;
      return this.scrollTabs.scrollTo({ x, y });
    }

    if (hasLeftViewportOverflow) {
      const isFirstTab = this.props.activeTab === 0;
      const x = isFirstTab ? 0 : currentTabLayout.x - screenMargin * 2;
      const y = 0;
      return this.scrollTabs.scrollTo({ x, y });
    }
    return null;
  }

  onTabLayout(event, page) {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.tabState[page] = { x, y, width, height };
    if (this.props.tabs.length === Object.keys(this.tabState).length) {
      this.setState({ renderUnderline: true });
    }
  }

  renderTab = (tab, page) => {
    const { activeTab, tabBadgeColor } = this.props;
    const { label, badge, badgeColor } = tab;
    const isTabActive = activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'navy';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    const textStyle = this.props.tabBarTextStyle || {};
    return (
      <TouchableOpacity
        style={[styles.tab, this.props.tabStyles.tab]}
        key={page}
        onPress={() => this.props.goToPage(page)}
        onLayout={event => this.onTabLayout(event, page)}
      >
        <Text
          style={[
            {
              color: isTabActive ? activeTextColor : inactiveTextColor,
              fontWeight: isTabActive ? '400' : '400',
            },
            textStyle,
          ]}
        >
          {label}
        </Text>
        {badge != null &&
          badge > 0 &&
          <View
            style={[
              styles.badgeBubble,
              this.props.tabStyles.badgeBubble,
              { backgroundColor: badgeColor || activeTextColor },
            ]}
          >
            <Text style={[styles.badgeText, this.props.tabStyles.badgeText]}>
              {badge || 0}
            </Text>
          </View>}
      </TouchableOpacity>
    );
  };

  renderUnderline() {
    const inputRange = Object.keys(this.tabState);
    const outputRangeLeft = [];
    const outputRangeWidth = [];

    for (const k in this.tabState) {
      if (this.tabState.hasOwnProperty(k)) {
        outputRangeLeft.push(this.tabState[k].x);
        outputRangeWidth.push(this.tabState[k].width);
      }
    }

    const left = this.props.scrollValue.interpolate({
      inputRange,
      outputRange: outputRangeLeft,
    });

    const width = this.props.scrollValue.interpolate({
      inputRange,
      outputRange: outputRangeWidth,
    });

    const tabUnderlineStyle = {
      position: 'absolute',
      backgroundColor: this.props.underlineColor || 'navy',
      height: 2,
      bottom: 0,
    };

    return <Animated.View style={[tabUnderlineStyle, { left }, { width }]} />;
  }

  render() {
    return (
      <View
        style={[
          styles.tabs,
          { backgroundColor: this.props.backgroundColor },
          this.props.style,
          this.props.tabBarStyle,
        ]}
      >
        <ScrollView
          horizontal
          contentContainerStyle={[
            styles.scrollContainer,
            this.props.scrollContainerStyle,
          ]}
          showsHorizontalScrollIndicator={false}
          ref={node => this.scrollTabs = node}
          bounces={false}
          scrollEventThrottle={16}
          onScroll={e =>
            this.setState({ tabScrollValue: e.nativeEvent.contentOffset.x })}
        >
          {this.props.tabs.map(this.renderTab)}
          {this.state.renderUnderline && this.renderUnderline()}
        </ScrollView>
      </View>
    );
  }
}

export default TabBar;
