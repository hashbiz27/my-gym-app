import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Colors } from "../theme";
import LibraryScreen from "../screens/LibraryScreen";
import ExerciseDetailScreen from "../screens/ExerciseDetailScreen";

const Stack = createNativeStackNavigator();

export default function LibraryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTitleStyle: { fontWeight: "700", color: Colors.gray900, fontSize: 17 },
        headerTintColor: Colors.primary,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Colors.white },
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
