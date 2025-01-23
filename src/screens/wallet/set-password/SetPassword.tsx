import type { NavigationProp } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { RootStackParamList } from '@/navigation/types';

import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { Button, Input, Title } from '@/components/templates';

import { setInKeychain } from '@/services/keychain';
import { encrypt, storage } from '@/services/mmkv';
import { createWallet } from '@/services/wallet';
import { setBitcoinWallet, setEVMWallet, setMinaWallet, setSolanaWallet } from '@/store/wallet';
import { runAfterUISync } from '@/utils/runAfterUISync';

function SetPassword() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute<StackScreenProps<RootStackParamList, Paths.SetPassword>['route']>();

  const { colors, components, gutters, layout } = useTheme();
  const { t } = useTranslation(['welcome', 'common']);
  const dispatch = useDispatch();

  const { mnemonic } = route.params;

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const validPassword = password.length >= 6 && password === confirmPassword;

  const encryptWallet = () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    runAfterUISync(async () => {
      encrypt(password);
      storage.set('password', password);
      await setInKeychain('password', `${password}`);
      const [evm, solana, bitcoin, mina] = await createWallet(mnemonic);
      dispatch(
        setEVMWallet({
          balance: 0,
          address: evm.address,
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        }),
      );
      dispatch(
        setSolanaWallet({
          balance: 0,
          address: solana.publicKey,
          publicKey: solana.publicKey,
          nativeCurrency: { name: 'SOL', symbol: 'SOL', decimals: 9 },
        }),
      );
      dispatch(
        setMinaWallet({
          balance: 0,
          address: mina.publicKey,
          publicKey: mina.publicKey,
          nativeCurrency: { name: 'MINA', symbol: 'MINA', decimals: 9 },
        }),
      );
      dispatch(
        setBitcoinWallet({
          balance: 0,
          address: bitcoin.address,
          publicKey: bitcoin.address,
          nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
        }),
      );
      storage.set('initialized', true);
      setLoading(false);
      navigation.navigate(Paths.Auth);
    });
  };

  return (
    <View style={components.screen}>
      <View style={gutters.padding_10}>
        <View style={components.indicator} />
      </View>
      <Title style={layout.flex_1} title="Set Password" subtitle="Set a password to secure your wallet" />
      <View style={[layout.flex_1, layout.center, layout.fullWidth]}>
        <View style={[layout.row, layout.center, gutters.paddingVertical_8]}>
          <Input
            autoFocus
            bottomSheet
            value={password}
            style={layout.w_80}
            keyboardType="number-pad"
            placeholder={t('common:password')}
            onChangeText={setPassword}
          />
          <View style={[layout.absolute, layout.right0]}>
            <TouchableOpacity
              style={[layout.flex_1, layout.center, gutters.paddingRight_12]}
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} color={colors.text_01} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[layout.row, layout.center, gutters.paddingVertical_8]}>
          <Input
            bottomSheet
            value={confirmPassword}
            style={layout.w_80}
            keyboardType="number-pad"
            placeholder={t('common:password')}
            onChangeText={setConfirmPassword}
          />
          <View style={[layout.absolute, layout.right0]}>
            <TouchableOpacity
              style={[layout.flex_1, layout.center, gutters.paddingRight_12]}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Ionicons
                name={confirmPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                color={colors.text_01}
                size={20}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={[layout.flex_1, layout.center, layout.fullWidth]}>
        <Button
          type="primary"
          text="Set Password"
          style={layout.w_80}
          onPress={encryptWallet}
          loading={loading}
          disabled={!validPassword}
        />
      </View>
    </View>
  );
}

export default SetPassword;
