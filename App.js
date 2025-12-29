import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfilesListScreen from "./screens/ProfilesListScreen";
import ProfileDetailScreen from "./screens/ProfileDetailScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  // env test (kalabilir)
  console.log("ENV TEST:", process.env.EXPO_PUBLIC_API_BASE_URL);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Profiles" component={ProfilesListScreen} />
        <Stack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
