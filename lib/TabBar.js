/**
 * Created by Konstantin Yakushin.
 * react-native-underline-tabbar
 */
// @flow
import React, { Component } from 'react';
import { Text, TouchableOpacity, View, Animated, ScrollView } from 'react-native';
import MatrixMath from 'react-native/Libraries/Utilities/MatrixMath';

import styles from './Styles';

function transformOrigin(matrix, origin) {
  const { x, y, z } = origin;

  const translate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(translate, x, y, z);
  MatrixMath.multiplyInto(matrix, translate, matrix);

  const untranslate = MatrixMath.createIdentityMatrix();
  MatrixMath.reuseTranslate3dCommand(untranslate, -x, -y, -z);
  MatrixMath.multiplyInto(matrix, matrix, untranslate);
}

function createTranslateXScaleX(scaleXFactor, x) {
  // prettier-ignore
  return [
    scaleXFactor, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, 0, 0, 1,
  ];
}

type TabType = {
  label: string,
  badge: string,
  badgeColor?: string,
};

type Props = {
  goToPage: Function,
  activeTab: number,
  tabs: TabType[],
  underlineColor: string,
  backgroundColor: string,
  activeTextColor: string,
  inactiveTextColor: string,
  tabBadgeColor: string,
  scrollValue: Animated.Value,
  scrollContainerStyle: Object,
  tabStyles: Object,
  tabMargin: number,
  style: Object,
  activeTabTextStyle: Object,
  tabBarTextStyle: Object,
  tabBarStyle: Object,
};

type State = {
  renderUnderline: boolean,
  tabScrollValue: number,
};

type LayoutType = {
  x: number,
  y: number,
  width: number,
  height: number,
};

type TabStateType = {
  [string | number]: LayoutType,
};

class TabBar extends Component<Props, State> {
  static defaultProps = {
    tabBarTextStyle: {},
    tabStyles: {
      tab: {},
    },
    scrollContainerStyle: {},
    style: {},
  };
  tabState: TabStateType = {};
  tabContainerLayout: LayoutType = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
  scrollContainerLayout: LayoutType = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
  underlineRef: ?any = null;
  scrollView: ?any = null;
  _animateListenedId: ?string = null;
  offsetCollection: ?Object = null;
  widthCollection: ?Object = null;
  scrollOffsetsCollection: ?Object = null;
  state = {
    renderUnderline: false,
    tabScrollValue: 0,
  };

  componentDidMount() {
    this._animateListenedId = this.props.scrollValue.addListener((event: { value: number }) => {
      const { value } = event;
      const dx = (this.offsetCollection && this.offsetCollection._interpolation(value)) || 0;
      const scaleX = (this.widthCollection && this.widthCollection._interpolation(value)) || 0;
      this.applyTransformToUnderline(this.underlineRef, scaleX, dx);
      if (this.scrollOffsetsCollection) {
        const scrollOffset =
          this.scrollOffsetsCollection && this.scrollOffsetsCollection._interpolation(value);
        if (this.scrollView) {
          this.scrollView.scrollTo({ x: scrollOffset, animated: false });
        }
      }
    });
  }

  componentWillUnmount() {
    if (this._animateListenedId) {
      this.props.scrollValue.removeListener(this._animateListenedId);
    }
  }

  measureTabsContainer = (event: Object) => {
    this.tabContainerLayout = event.nativeEvent.layout;
    this.checkMeasures();
  };

  onScrollContentSizeChange = (width: number, height: number) => {
    this.scrollContainerLayout = { width, height, x: 0, y: 0 };
    this.checkMeasures();
  };

  setUnderlineRef = (ref: any) => {
    this.underlineRef = ref;
  };

  applyTransformToUnderline(ref: any, scaleXFactor: number, dx: number) {
    if (!ref) return;
    const matrix = createTranslateXScaleX(scaleXFactor, dx);
    transformOrigin(matrix, { x: -0.5, y: 0, z: 0 });
    ref.setNativeProps({
      style: {
        transform: [
          {
            matrix,
          },
        ],
      },
    });
  }

  onTabLayout(event: Object, page: number) {
    const { x, y, width, height } = event.nativeEvent.layout;
    this.tabState[page] = { x, y, width, height };
    if (this.props.tabs.length === Object.keys(this.tabState).length) {
      this.setState({ renderUnderline: true }, () => {
        this.applyTransformToUnderline(
          this.underlineRef,
          this.tabState[0].width,
          this.tabState[0].x,
        );
        this.checkMeasures();
      });
    }
  }

  checkMeasures = () => {
    if (
      this.state.renderUnderline &&
      this.tabContainerLayout.width !== 0 &&
      this.scrollContainerLayout.width !== 0
    ) {
      this.calculateInterpolations();
    }
  };

  calculateInterpolations = () => {
    const inputRange = Object.keys(this.tabState);
    const outputRangeLeft = [];
    const outputRangeWidth = [];
    const tabContainerWidth = this.tabContainerLayout.width;
    const scrollWidth = this.scrollContainerLayout.width;
    const marginValue = 20;
    for (let i = 0, len = inputRange.length; i < len; i += 1) {
      const key = inputRange[i];
      outputRangeLeft.push(this.tabState[key].x);
      outputRangeWidth.push(this.tabState[key].width);
    }
    // $FlowFixMe
    this.offsetCollection = this.props.scrollValue.interpolate({
      inputRange, // $FlowFixMe
      outputRange: outputRangeLeft, // $FlowFixMe
    });
    // $FlowFixMe
    this.widthCollection = this.props.scrollValue.interpolate({
      inputRange, // $FlowFixMe
      outputRange: outputRangeWidth, // $FlowFixMe
    });
    if (scrollWidth <= tabContainerWidth) {
      return;
    }
    const outputRangeScroll = [];
    for (let i = 0, len = inputRange.length; i < len; i += 1) {
      if (i === 0) {
        outputRangeScroll.push(0);
        continue; // eslint-disable-line
      }
      const isLast = i === len - 1;
      const offset = outputRangeLeft[i];
      const tabWidth = outputRangeWidth[i];
      const nextTabWidth = outputRangeWidth[i + 1] || 0;
      let scrollOffset = offset;

      if (offset + tabWidth + nextTabWidth + 20 + 20 >= scrollWidth) {
        if (isLast) {
          scrollOffset = offset - (tabContainerWidth - (tabWidth + marginValue));
        } else {
          scrollOffset =
            offset -
            (tabContainerWidth - (tabWidth + marginValue) + (nextTabWidth + 2 * marginValue)) / 2;
        }
      } else {
        scrollOffset =
          offset -
          (tabContainerWidth - (tabWidth + marginValue) + (nextTabWidth + 2 * marginValue)) / 2;
        scrollOffset = scrollOffset >= 0 ? scrollOffset : 0;
      }
      outputRangeScroll.push(scrollOffset);
    }
    // $FlowFixMe
    this.scrollOffsetsCollection = this.props.scrollValue.interpolate({
      inputRange: [-1, ...inputRange], // $FlowFixMe
      outputRange: [-40, ...outputRangeScroll], // $FlowFixMe
    });
  };

  renderUnderline() {
    const tabUnderlineStyle = {
      position: 'absolute',
      backgroundColor: this.props.underlineColor || 'navy',
      height: 2,
      width: 1,
      bottom: 0,
      padding: 0,
    };

    return <Animated.View ref={this.setUnderlineRef} style={[tabUnderlineStyle]} />;
  }

  renderTab = (tab: TabType, page: number) => {
    const { activeTab, tabBadgeColor, activeTabTextStyle } = this.props;
    const { label, badge, badgeColor } = tab;
    const isTabActive = activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'navy';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    const textStyle = this.props.tabBarTextStyle;
    return (
      <TouchableOpacity
        style={[
          styles.tab,
          this.props.tabMargin && { marginLeft: this.props.tabMargin },
          this.props.tabStyles.tab,
        ]}
        key={page}
        onPress={() => this.props.goToPage(page)}
        onLayout={event => this.onTabLayout(event, page)}
      >
        <Text
          style={[
            {
              color: isTabActive ? activeTextColor : inactiveTextColor,
            },
            isTabActive && activeTabTextStyle,
            textStyle,
          ]}
        >
          {label}
        </Text>
        {badge != null &&
          +badge > 0 && (
            <View
              style={[
                styles.badgeBubble,
                this.props.tabStyles.badgeBubble,
                { backgroundColor: badgeColor || tabBadgeColor || activeTextColor },
              ]}
            >
              <Text style={[styles.badgeText, this.props.tabStyles.badgeText]}>{badge}</Text>
            </View>
          )}
      </TouchableOpacity>
    );
  };

  render() {
    const {
      style,
      backgroundColor,
      tabBarStyle,
      tabMargin,
      scrollContainerStyle,
      tabs,
    } = this.props;
    return (
      <View
        style={[styles.tabs, { backgroundColor }, style, tabBarStyle]}
        onLayout={this.measureTabsContainer}
      >
        <ScrollView
          horizontal
          contentContainerStyle={[
            styles.scrollContainer,
            tabMargin && { paddingRight: tabMargin },
            scrollContainerStyle,
          ]}
          showsHorizontalScrollIndicator={false}
          onContentSizeChange={this.onScrollContentSizeChange}
          ref={node => (this.scrollView = node)}
          bounces={false}
          scrollEventThrottle={1}
        >
          {tabs.map(this.renderTab)}
          {this.state.renderUnderline && this.renderUnderline()}
        </ScrollView>
      </View>
    );
  }
}

export default TabBar;
