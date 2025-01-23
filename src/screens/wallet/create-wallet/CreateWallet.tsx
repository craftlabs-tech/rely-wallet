import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { Button, Input, Title } from '@/components/templates';

import { setInKeychain } from '@/services/keychain';
import { encrypt, storage } from '@/services/mmkv';
import { createWallet, generateMnemonic } from '@/services/wallet';
import { setBitcoinWallet, setEVMWallet, setMinaWallet, setSolanaWallet } from '@/store/wallet';
import { runAfterUISync } from '@/utils/runAfterUISync';

function CreateWallet() {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation(['wallet', 'welcome', 'common']);
  const { colors, components, gutters, layout } = useTheme();

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('111111');
  const [confirmPassword, setConfirmPassword] = useState('111111');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    setValidPassword(password.length >= 6 && password === confirmPassword);
  }, [password, confirmPassword]);

  const createWallets = useCallback(() => {
    setLoading(true);
    void runAfterUISync(async () => {
      const mnemonic = generateMnemonic();
      await setInKeychain('mnemonic', `${mnemonic}`);
      await setInKeychain('password', `${password}`);
      const [evm, solana, bitcoin, mina] = await createWallet(mnemonic);

      encrypt(password);
      storage.set('password', password);
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
        setBitcoinWallet({
          balance: 0,
          address: bitcoin.address,
          publicKey: bitcoin.address,
          nativeCurrency: { name: 'BTC', symbol: 'BTC', decimals: 8 },
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
      setLoading(false);
      storage.set('initialized', true);
      navigation.navigate(Paths.Auth);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  return (
    <View style={components.screen}>
      <View style={gutters.padding_10}>
        <View style={components.indicator} />
      </View>
      <Title
        style={[layout.flex_1, gutters.paddingHorizontal_12]}
        title={t('welcome:create_wallet')}
        subtitle={t('import.tip')}
      />
      <View style={[layout.flex_1, layout.center, layout.fullWidth, gutters.gap_12]}>
        <View style={[layout.center, layout.row]}>
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
        <View style={[layout.center, layout.row]}>
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
          text={t('welcome:create_wallet')}
          style={layout.w_80}
          onPress={createWallets}
          loading={loading}
          disabled={!validPassword}
        />
      </View>
    </View>
  );
}

export default CreateWallet;
