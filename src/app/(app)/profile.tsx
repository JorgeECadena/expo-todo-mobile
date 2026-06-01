import { View, Text } from "react-native";
import { useSession } from '@/context/ctx';

const Profile = () => {
  const { signOut } = useSession();
    return (
        <View className="flex-1 justify-center items-center">
            <Text className="text-blue-700">Profile</Text>
            <Text
                onPress={() => {
                // The guard in `RootNavigator` redirects back to the sign-in screen.
                signOut();
                }} className='text-red-700'>
                Sign Out
            </Text> 
        </View>
    );
};

export default Profile;