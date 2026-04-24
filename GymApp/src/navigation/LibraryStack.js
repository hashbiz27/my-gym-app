import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LibraryScreen from "../screens/LibraryScreen";
import ExerciseDetailScreen from "../screens/ExerciseDetailScreen";

const Stack = createNativeStackNavigator();

export default function LibraryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#ffffff" },
        headerTitleStyle: { fontWeight: "700", color: "#111827", fontSize: 17 },
        headerTintColor: "#4f46e5",
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#ffffff" },
      }}
    >
      <Stack.Screen
        name="LibraryList"
        component={LibraryScreen}
        options={{ title: "Exercise Library" }}
      />
      <Stack.Screen
        name="ExerciseDetail"
        component={ExerciseDetailScreen}
        options={({ route }) => ({ title: route.params.name })}
      />
    </Stack.Navigator>
  );
}
