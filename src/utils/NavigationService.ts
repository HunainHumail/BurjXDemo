import {
    StackActions,
    CommonActions,
    DrawerActions,
    TabActions,
    NavigationContainerRef,
    NavigationProp,
    Route,
  } from '@react-navigation/native';
  import React from 'react';
  import { ParamListBase } from '@react-navigation/routers';
  
  type NavigationParams = Record<string, any>;
  
  export const navigationRef = React.createRef<NavigationContainerRef<ParamListBase>>();
  
  function navigate(routeName: string, params?: NavigationParams, stackName?: string): void {
    if (stackName) {
      navigationRef.current?.navigate(stackName as never, {
        screen: routeName,
        params,
      } as never);
    } else {
      navigationRef.current?.navigate(routeName as never, params as never);
    }
  }
  
  function replace(routeName: string, params?: NavigationParams): void {
    navigationRef.current?.dispatch(StackActions.replace(routeName, params));
  }
  
  function push(routeName: string, params?: NavigationParams): void {
    navigationRef.current?.dispatch(StackActions.push(routeName, params));
  }
  
  function pop(number?: number): void {
    navigationRef.current?.dispatch(StackActions.pop(number));
  }
  
  function popToTop(): void {
    navigationRef.current?.dispatch(StackActions.popToTop());
  }
  
  function getNavigator(): NavigationContainerRef<ParamListBase> | null {
    return navigationRef.current;
  }
  
  function reset(name: string, params?: NavigationParams): void {
    const resetAction = CommonActions.reset({
      index: 0,
      routes: [{ name, params }],
    });
    navigationRef.current?.dispatch(resetAction);
  }
  
  function jumpTo(routeName: string, params?: NavigationParams): void {
    navigationRef.current?.dispatch(TabActions.jumpTo(routeName, params));
  }
  
  function getCurrentRoute(): Route<string> | undefined {
    return getNavigator()?.getCurrentRoute();
  }
  
  function getCurrentRouteName(): string | undefined {
    return getNavigator()?.getCurrentRoute()?.name;
  }
  
  function goBack(): void {
    navigationRef.current?.dispatch(CommonActions.goBack());
  }
  
  function closeDrawer(): void {
    navigationRef.current?.dispatch(DrawerActions.closeDrawer());
  }
  
  function openDrawer(): void {
    navigationRef.current?.dispatch(DrawerActions.openDrawer());
  }
  
  function hideHeader(navigation: NavigationProp<ParamListBase>): void {
    React.useLayoutEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, []);
  }
  
  function setTitle(
    navigation: NavigationProp<ParamListBase>,
    title: string,
    dependencies: any[] = []
  ): void {
    React.useEffect(() => {
      navigation.setOptions({ title });
    }, dependencies);
  }
  
  interface NavigationServiceType {
    navigationRef: React.RefObject<NavigationContainerRef<ParamListBase>>;
    replace: (routeName: string, params?: NavigationParams) => void;
    push: (routeName: string, params?: NavigationParams) => void;
    pop: (number?: number) => void;
    jumpTo: (routeName: string, params?: NavigationParams) => void;
    getCurrentRoute: () => Route<string> | undefined;
    getNavigator: () => NavigationContainerRef<ParamListBase> | null;
    navigate: (routeName: string, params?: NavigationParams, stackName?: string) => void;
    reset: (name: string, params?: NavigationParams) => void;
    popToTop: () => void;
    goBack: () => void;
    closeDrawer: () => void;
    openDrawer: () => void;
    hideHeader: (navigation: NavigationProp<ParamListBase>) => void;
    setTitle: (navigation: NavigationProp<ParamListBase>, title: string, dependencies?: any[]) => void;
    getCurrentRouteName: () => string | undefined;
  }
  
  const NavigationService: NavigationServiceType = {
    navigationRef,
    replace,
    push,
    pop,
    jumpTo,
    getCurrentRoute,
    getNavigator,
    navigate,
    reset,
    popToTop,
    goBack,
    closeDrawer,
    openDrawer,
    hideHeader,
    setTitle,
    getCurrentRouteName,
  };
  
  export default NavigationService;