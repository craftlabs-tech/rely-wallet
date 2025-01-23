import { useNavigation } from '@react-navigation/native';
import { Alert, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { Button, Title } from '@/components/templates';

import { resetAllKeychain } from '@/services/keychain';
import { ErrorLog, logger } from '@/services/logger';
import { storage } from '@/store';
import { resetState } from '@/store/wallet';

function Reset() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { components, gutters, layout } = useTheme();

  const reset = () => {
    Alert.prompt('Reset Wallet', 'Type "RESET" to confirm', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Reset',
        onPress: (value) => {
          if (value === 'RESET') {
            resetAllKeychain()
              .then(() => {
                storage.clearAll();
                dispatch(resetState());
                storage.set('initialized', false);
                navigation.navigate(Paths.Welcome);
              })
              .catch((error) =>
                logger.error(new ErrorLog(`Failed to reset wallet: ${JSON.stringify(error)}`), { type: 'error' }),
              );
          } else {
            Toast.show({
              type: 'error',
              text1: 'Reset Wallet',
              text2: 'Type "RESET" to confirm',
              position: 'top',
              text1Style: { fontFamily: 'Rubik-Medium' },
              text2Style: { fontFamily: 'Rubik-Medium' },
            });
          }
        },
      },
    ]);
  };

  return (
    <View style={[components.screen, layout.justifyAround, gutters.paddingHorizontal_24]}>
      <Title
        title="Reset Wallet"
        subtitle="Resetting your password will delete all your wallet data. Please make sure you have a backup of your wallet before proceeding."
      />
      <Button type="negative" text="Reset Wallet" onPress={reset} style={layout.w_70} />
    </View>
  );
}

export default Reset;
