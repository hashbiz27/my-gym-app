import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import WorkoutScreen from "../screens/WorkoutScreen";
import LibraryScreen from "../screens/LibraryScreen";
import HistoryScreen from "../screens/HistoryScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = "#4f46e5";
const INACTIVE_COLOR = "#9ca3af";

function tabIcon(name) {
  return ({ color, size, focused }) => (
    <Ionicons
      name={focused ? name : `${name}-outline`}
      size={size}
      color={color}
    />
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
          backgroundColor: "#ffffff",
          borderTopColor: "#f3f4f6",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 2,
        },
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
        name="Library"
        component={LibraryScreen}
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
