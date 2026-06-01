// import { Text, View } from 'react-native';

// export default function HomeScreen() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-2xl text-gray-700">Barbo</Text>
//     </View>
//   );
// }
import { Text, View } from 'react-native';

import { useSession } from '@/context/ctx';

export default function Index() {
  const { signOut } = useSession();
  return (
    <View className='flex-1 justify-center items-center'>
      <Text
        onPress={() => {
          // The guard in `RootNavigator` redirects back to the sign-in screen.
          signOut();
        }} className='text-red-700'>
        Sign Out
      </Text>
    </View>
  );
}
