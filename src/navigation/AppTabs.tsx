import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import TasksScreen from '../screens/TasksScreen';
import SprintsScreen from '../screens/SprintsScreen';
import CrmScreen from '../screens/CrmScreen';
import VendorsScreen from '../screens/VendorsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import RenewalsScreen from '../screens/RenewalsScreen';
import SalesScreen from '../screens/SalesScreen';
import AssetsScreen from '../screens/AssetsScreen';
import InventoryScreen from '../screens/InventoryScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MoreScreen from '../screens/MoreScreen';
import PortalScreen from '../screens/PortalScreen';

const Tab = createBottomTabNavigator();
const headerOptions = {
  headerStyle: { backgroundColor: COLORS.blue },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '800' as const },
};

function WorkStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={headerOptions}>
      <S.Screen name="Tasks" component={TasksScreen} />
      <S.Screen name="Sprints" component={SprintsScreen} />
    </S.Navigator>
  );
}

function ManageStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={headerOptions}>
      <S.Screen name="CRM" component={CrmScreen} />
      <S.Screen name="Vendors" component={VendorsScreen} />
    </S.Navigator>
  );
}

function FinanceStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={headerOptions}>
      <S.Screen name="Invoices" component={InvoicesScreen} />
      <S.Screen name="Renewals" component={RenewalsScreen} />
      <S.Screen name="Sales" component={SalesScreen} />
    </S.Navigator>
  );
}

function MoreStack() {
  const S = createNativeStackNavigator();
  return (
    <S.Navigator screenOptions={headerOptions}>
      <S.Screen name="More Menu" component={MoreScreen} options={{ title: 'More' }} />
      <S.Screen name="Assets" component={AssetsScreen} />
      <S.Screen name="Inventory" component={InventoryScreen} />
      <S.Screen name="Notifications" component={NotificationsScreen} />
      <S.Screen name="Portal" component={PortalScreen} options={{ headerShown: false }} />
    </S.Navigator>
  );
}

const ICONS: Record<string, string> = { Home: '◆', Work: '✓', Manage: '◎', Finance: '$', More: '≡' };

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.blue,
        tabBarInactiveTintColor: COLORS.muted,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: COLORS.line,
          paddingBottom: 6,
          paddingTop: 4,
          height: 62,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color }) => (
          <Text style={{ fontSize: 18, color, fontWeight: '900' }}>{ICONS[route.name] ?? '•'}</Text>
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Work" component={WorkStack} />
      <Tab.Screen name="Manage" component={ManageStack} />
      <Tab.Screen name="Finance" component={FinanceStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
