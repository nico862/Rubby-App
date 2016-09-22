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
    label: string;
    screen: string;
    icon: string;
    selectedIcon: string;
    title: string;
    navigatorStyle?: NavigatorStyle;
  }

  export interface TabStyleConfig {
    tabBarButtonColor?: string;
    tabBarSelectedButtonColor?: string;
    tabBarBackgroundColor?: string;
  }

  export interface TabBasedAppConfig {
    tabs?: TabConfig[];
    tabsStyle?: TabStyleConfig;
    drawer?: any;
  }

  export namespace Navigation {
    function registerComponent(screenId: string, generator: {(): any}, store?: any, provider?: any): void;

    function startTabBasedApp(config: TabBasedAppConfig): void;
  }

  export namespace Navigator {
    function push(params: any): void;
  }
}