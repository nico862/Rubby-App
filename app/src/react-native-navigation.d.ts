declare module "react-native-navigation" {
  import * as React from "react";

  export interface NavigatorStyle {
    tabBarBackgroundColor?: string;
    navBarTextColor?: string;
    navBarBackgroundColor?: string;
    navBarButtonColor?: string;
    navBarHidden?: boolean;
    navBarHideOnScroll?: boolean;
    navBarTranslucent?: boolean;
    navBarTransparent?: boolean;
    navBarNoBorder?: boolean;
    drawUnderNavBar?: boolean;
    drawUnderTabBar?: boolean;
    statusBarBlur?: boolean;
    navBarBlur?: boolean;
    tabBarHidden?: boolean;
    statusBarHideWithNavBar?: boolean;
    statusBarHidden?: boolean;
    statusBarTextColorScheme?: "dark" | "light";
  }

  export interface TabConfig {
    label?: string;
    screen: string;
    icon: string;
    selectedIcon: string;
    title: string;
    navigatorStyle?: NavigatorStyle;
    navigatorButtons?: NavigatorButtonsConfig;
    overrideBackPress?: boolean;
  }

  export interface TabStyleConfig {
    tabBarButtonColor?: string;
    tabBarSelectedButtonColor?: string;
    tabBarBackgroundColor?: string;
  }

  export interface AppStyleConfig {
    bottomTabBadgeTextColor?: string;
    bottomTabBadgeBackgroundColor?: string;
  }

  export interface ButtonConfig {
    id: string;
    title?: string;
  }

  export interface NavigatorButtonsConfig {
    rightButtons?: ButtonConfig[];
  }

  export interface TabBasedAppConfig {
    tabs?: TabConfig[];
    tabsStyle?: TabStyleConfig;
    drawer?: any;
    passProps?: any;
    animationType?: string;
    title?: string;
    appStyle?: AppStyleConfig;
  }

  export interface SingleScreenAppConfig {
    screen: {
      screen: string;
      title?: string;
      navigatorStyle?: NavigatorStyle;
    };
    passProps?: any;
  }

  export namespace Navigation {
    function registerComponent(screenId: string, generator: {(): any}, store?: any, provider?: any): void;

    function startTabBasedApp(config: TabBasedAppConfig): void;

    function startSingleScreenApp(config: SingleScreenAppConfig): void;
  }

  export namespace Navigator {
    function push(params: any): void;
  }
}