import type { RootState } from '@/store';
import type { EVMWallet, SolanaWallet } from '@/store/wallet';

import { MenuView } from '@react-native-menu/menu';
import Ionicons from '@react-native-vector-icons/ionicons';
import MCIcons from '@react-native-vector-icons/material-design-icons';
import { useNavigation } from '@react-navigation/native';
import { Platform, Text, TouchableOpacity, useColorScheme, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '@/theme';

import { Avatar } from '@/components/templates';

import { setTheme } from '@/store/wallet';
import { abbreviateAddress } from '@/utils/wallet';

const IS_ANDROID = Platform.OS === 'android';

function Header() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { borders, backgrounds, colors, components, fonts, layout, gutters, ...theme } = useTheme();

  const activeTheme = useSelector((s: RootState) => s.wallet.theme);
  const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
  const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;
  const solanaWallet = useSelector((s: RootState) => s.wallet.solana.at(activeWallet)) as SolanaWallet;

  const handleMenuPress = (event: string) => {
    const themeVariant = event === 'dark' ? 'dark' : 'default';
    if (event === 'system') {
      const systemTheme = colorScheme === 'dark' ? 'dark' : 'default';
      theme.changeTheme(systemTheme);
      dispatch(setTheme('system'));
    } else if (event === 'settings') {
      navigation.navigate('settings');
    } else {
      theme.changeTheme(themeVariant);
      dispatch(setTheme(themeVariant));
    }
  };

  const scan = () => {
    navigation.navigate('scan');
  };

  return (
    <View style={[layout.fullWidth, layout.row, layout.justifyBetween, IS_ANDROID && gutters.paddingTop_6]}>
      <View style={[layout.flex_1, layout.center]}>
        <MenuView
          title="Menu"
          style={layout.z10}
          shouldOpenOnLongPress={false}
          themeVariant={theme.variant === 'dark' ? 'dark' : 'light'}
          onPressAction={({ nativeEvent }) => handleMenuPress(nativeEvent.event)}
          actions={[
            {
              id: 'theme',
              title: 'Theme',
              titleColor: colors.black,
              imageColor: colors.icon_01,
              image: 'moon.stars.fill',
              subactions: [
                {
                  id: 'dark',
                  state: activeTheme === 'dark' ? 'on' : 'off',
                  title: 'Dark Theme',
                  titleColor: colors.black,
                  imageColor: colors.icon_01,
                  image: 'moon.stars.fill',
                },
                {
                  id: 'light',
                  state: activeTheme === 'default' ? 'on' : 'off',
                  title: 'Light Theme',
                  titleColor: colors.black,
                  imageColor: colors.icon_01,
                  image: 'sun.max.fill',
                },
                {
                  id: 'system',
                  state: activeTheme === 'system' ? 'on' : 'off',
                  title: 'System Theme',
                  titleColor: colors.black,
                  imageColor: colors.icon_01,
                  image: 'gear',
                },
              ],
            },
            {
              id: 'settings',
              title: 'Settings',
              titleColor: colors.black,
              imageColor: colors.icon_01,
              image: 'gear',
            },
          ]}>
          <TouchableOpacity>
            <MCIcons size={24} name="dots-horizontal" color={colors.text_01} style={[layout.opacity_75]} />
          </TouchableOpacity>
        </MenuView>
      </View>
      <TouchableOpacity
        style={[
          layout.row,
          layout.flex_3,
          layout.justifyBetween,
          borders.rounded_48,
          gutters.padding_4,
          backgrounds.ui_01,
          borders.w_1,
          { borderColor: colors.ui_01 },
        ]}>
        <View style={[layout.row, layout.center]}>
          <Avatar address={evmWallet.address} />
          <View style={[layout.col, layout.justifyCenter, gutters.paddingLeft_12, gutters.gap_2]}>
            <Text style={[fonts.size_14, fonts.rubikBold, fonts.icon_04]}>
              {/* {evmWallet.ens ? evmWallet.ens.name : abbreviateAddress(evmWallet.address)} */}
              {abbreviateAddress(solanaWallet.address)}
            </Text>
            <Text style={[fonts.size_14, fonts.rubikMedium, fonts.text_02]}>{solanaWallet.balance.toFixed(4)} SOL</Text>
          </View>
        </View>
        <View style={[layout.justifyCenter, layout.itemsCenter, gutters.paddingRight_8]}>
          <Ionicons name="chevron-down" size={24} color={colors.text_02} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={scan} style={[layout.flex_1, layout.justifyCenter, layout.itemsCenter]}>
        <Ionicons name="scan" size={24} color={colors.text_01} style={[layout.opacity_75]} />
      </TouchableOpacity>
    </View>
  );
}

export default Header;
