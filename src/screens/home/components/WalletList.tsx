import type { RootState } from '@/store';
import type { BitcoinWallet, EVMWallet, MinaWallet, SolanaWallet } from '@/store/wallet';

import Feather from '@react-native-vector-icons/feather';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { useSelector } from 'react-redux';

import { useTheme } from '@/theme';
import bitcoin from '@/theme/assets/images/tokens/bitcoin.png';
import ethereum from '@/theme/assets/images/tokens/ethereum.png';
import mina from '@/theme/assets/images/tokens/mina.png';
import solana from '@/theme/assets/images/tokens/solana.png';

import { abbreviateAddress, formatCurrency } from '@/utils/wallet';

function Wallets() {
  const navigation = useNavigation();
  const { backgrounds, colors, components, fonts, gutters, layout } = useTheme();

  const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
  const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;
  const minaWallet = useSelector((s: RootState) => s.wallet.mina.at(activeWallet)) as MinaWallet;
  const solanaWallet = useSelector((s: RootState) => s.wallet.solana.at(activeWallet)) as SolanaWallet;
  const bitcoinWallet = useSelector((s: RootState) => s.wallet.bitcoin.at(activeWallet)) as BitcoinWallet;

  const [wallets, setWallets] = useState([evmWallet, solanaWallet, bitcoinWallet, minaWallet]);

  const handleWalletPress = (wallet: EVMWallet | MinaWallet | SolanaWallet) => {
    navigation.navigate('wallet', { wallet });
  };

  useEffect(() => {
    setWallets([
      // { color: '#105C67', ...evmWallet, network: 'ethereum' },
      { color: '#6474D7', ...solanaWallet, network: 'solana' },
      // { color: '#F2A365', ...bitcoinWallet, network: 'bitcoin' },
      // { color: '#E1804D', ...minaWallet, network: 'mina' },
    ]);
  }, [evmWallet, minaWallet, solanaWallet, bitcoinWallet]);

  const networkIcon = (network: string) => {
    if (network === 'ethereum') {
      return <Image source={ethereum} style={{ width: 52, height: 52 }} />;
    }
    if (network === 'mina') {
      return <Image source={mina} style={{ width: 52, height: 52 }} />;
    }
    if (network === 'solana') {
      return <Image source={solana} style={{ width: 52, height: 52 }} />;
    }
    if (network === 'bitcoin') {
      return <Image source={bitcoin} style={{ width: 52, height: 52 }} />;
    }
  };

  return (
    <View style={[layout.flex_1, layout.w_90, gutters.paddingTop_32]}>
      <View style={[layout.row, layout.justifyBetween, gutters.paddingHorizontal_6]}>
        <Text style={[fonts.rubikRegular, fonts.text_01, layout.opacity_80]}>My Wallets</Text>
        <View style={[layout.row, layout.center, gutters.gap_16]}>
          <TouchableOpacity>
            <Feather style={[layout.opacity_80]} size={16} color={colors.text_01} name="edit" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Svg viewBox="0 0 48 48" width={16} height={16} color={colors.text_01} opacity={0.8}>
              <G fill={colors.text_01}>
                <Circle cx={33.5} cy={22.6} r={2.4} />
                <Path d="M40.2.7c-.2 0-.4 0-.7.1l-31.1 6c-2.1.4-3.9 2.6-3.9 5v7h3v-7c0-1 .8-1.9 1.4-2l31.1-6h.2s.2.2.2.6v4.1h3V4.3c0-2.1-1.4-3.6-3.2-3.6z" />
                <Path d="M42.8 7.6h-34c-2.3 0-4.2 1.9-4.2 4.2V27c1.6-.7 3.3-1.1 5.1-1.1 6.6 0 12.1 5.1 12.6 11.6h20.5c2.3 0 4.2-1.9 4.2-4.2V11.8c0-2.3-1.9-4.2-4.2-4.2zm1.9 20.5H33.5c-3 0-5.5-2.5-5.5-5.5s2.5-5.5 5.5-5.5h11.2v11z" />
                <Path d="M9.6 29.9c-4.8 0-8.7 3.9-8.7 8.7s3.9 8.7 8.7 8.7 8.7-3.9 8.7-8.7-3.9-8.7-8.7-8.7zM13.9 40H11v2.9c0 .8-.6 1.4-1.4 1.4-.8 0-1.4-.6-1.4-1.4V40H5.3c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4h2.9v-2.9c0-.8.6-1.4 1.4-1.4.8 0 1.4.6 1.4 1.4v2.9h2.9c.8 0 1.4.6 1.4 1.4s-.6 1.4-1.4 1.4z" />
              </G>
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={wallets}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleWalletPress(item)}
            style={[components.card, layout.center, gutters.marginTop_12, backgrounds.ui_01]}>
            <View style={[layout.row, layout.center, layout.fullWidth, layout.justifyBetween]}>
              <View style={[layout.row, layout.center]}>
                {/* <Avatar address={item.address} /> */}
                {networkIcon(item.network)}
                <View style={[layout.center, layout.itemsStart, gutters.paddingHorizontal_12, gutters.gap_4]}>
                  <Text style={[fonts.text_01, fonts.rubikMedium, layout.opacity_75]}>
                    {abbreviateAddress(item.address)}
                  </Text>
                  <Text style={[fonts.text_02, fonts.rubikMedium]}>{formatCurrency(item.balance)}</Text>
                </View>
              </View>
              <View style={[layout.justifyCenter, layout.itemsEnd, gutters.paddingHorizontal_8]}>
                <Feather name="chevron-right" size={24} color={colors.text_02} />
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.address}
      />
    </View>
  );
}

export default Wallets;
