import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { Button, Title } from '@/components/templates';

import { setInKeychain } from '@/services/keychain';
import { logger } from '@/services/logger';
import { validateMnemonic, validatePrivateKey } from '@/services/wallet';

function ImportWallet() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation(['welcome', 'common', 'import']);
  const { colors, components, gutters, layout } = useTheme();

  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState('');

  const validMnemonic = validateMnemonic(credentials.trimStart().trimEnd());
  const validPrivateKey = validatePrivateKey(credentials.trimStart().trimEnd());

  const isCredentialsValid = () => {
    if (validMnemonic || validPrivateKey) {
      return true;
    }
    return false;
  };

  const importCredentials = async () => {
    if (validMnemonic) {
      setLoading(true);
      const phrase = credentials.trimStart().trimEnd();
      await setInKeychain('mnemonic', phrase);
      setLoading(false);
      Keyboard.dismiss();
      navigation.navigate(Paths.SetPassword, { mnemonic: phrase });
    }
    if (validPrivateKey) {
      logger.debug('TODO: Import using private key');
    }
  };

  return (
    <View style={[layout.justifyAround, components.screen]}>
      <View style={gutters.padding_10}>
        <View style={components.indicator} />
      </View>
      <Title
        style={[layout.flex_1, gutters.paddingHorizontal_12]}
        title={t('import:title')}
        subtitle={t('import:description')}
      />
      <View style={[layout.flex_1, layout.center, layout.fullWidth]}>
        <View style={[layout.row, gutters.paddingVertical_8]}>
          <BottomSheetTextInput
            multiline
            autoFocus
            autoCorrect={false}
            numberOfLines={4}
            value={credentials}
            keyboardType="default"
            style={components.textArea}
            placeholder={t('common:seed_phrase')}
            placeholderTextColor={colors.text_02}
            onChangeText={(text) => setCredentials(text)}
          />
        </View>
      </View>
      <View style={[layout.flex_1, layout.center, layout.fullWidth]}>
        <Button
          type="primary"
          loading={loading}
          style={layout.w_80}
          text={t('welcome:import_wallet')}
          onPress={importCredentials}
          disabled={!isCredentialsValid()}
        />
      </View>
    </View>
  );
}

export default ImportWallet;
