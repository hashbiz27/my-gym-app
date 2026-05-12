import { useRef } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../theme";
import WorkoutScreen from "../screens/WorkoutScreen";
import BodyScreen from "../screens/BodyScreen";
import LibraryStack from "./LibraryStack";
import HistoryScreen from "../screens/HistoryScreen";
import AnalysisScreen from "../screens/AnalysisScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = Colors.primary;
const INACTIVE_COLOR = Colors.textMuted;

function tabIcon(name) {
  return ({ color, size, focused }) => (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={color}
    />
  );
}

function AnimatedTabButton({ children, onPress, onLongPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.spring(scale, {
      toValue: 0.82,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();
  }

  function handlePressOut() {
    Animated.spring(scale, {
      toValue: 1,
      speed: 20,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={style}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.borderLight,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 2,
        },
        tabBarButton: (props) => <AnimatedTabButton {...props} />,
      }}
    >
      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          title: "Today",
          tabBarIcon: tabIcon("barbell"),
        }}
      />
      <Tab.Screen
        name="Body"
        component={BodyScreen}
        options={{
          title: "Body",
          tabBarIcon: tabIcon("scale"),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryStack}
        options={{
          title: "Library",
          tabBarIcon: tabIcon("library"),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "History",
          tabBarIcon: tabIcon("time"),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          title: "Analysis",
          tabBarIcon: tabIcon("stats-chart"),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
          tabBarIcon: tabIcon("settings"),
        }}
      />
    </Tab.Navigator>
  );
}
