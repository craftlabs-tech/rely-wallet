/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { RootState } from '@/store';
import type { EVMWallet } from '@/store/wallet';

import { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

// import { fetchBalance, fetchEnsAvatar, fetchEnsName } from 'wagmi/actions';

import { useTheme } from '@/theme';

import Actions from '@/screens/home/components/Actions';
import Header from '@/screens/home/components/Header';
import Wallets from '@/screens/home/components/WalletList';

import { ErrorLog, logger } from '@/services/logger';
import { updateEVMWallet } from '@/store/wallet';
import { formatCurrency } from '@/utils/wallet';

function Home() {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
  const { backgrounds, fonts, layout, gutters } = useTheme();

  const activeWallet = useSelector((s: RootState) => s.wallet.accountIndex);
  const evmWallet = useSelector((s: RootState) => s.wallet.evm.at(activeWallet)) as EVMWallet;

  // const fetchEns = useCallback(
  //   async (address: string) => {
  //     const ensName = await fetchEnsName({ address: address as any });
  //     if (!ensName) {
  //       return;
  //     }
  //     const ensAvatar = await fetchEnsAvatar({ name: ensName });
  //     dispatch(
  //       updateEVMWallet({
  //         address: evmWallet.address,
  //         balance: evmWallet.balance,
  //         ens: { name: ensName, avatarUrl: ensAvatar },
  //         nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  //       }),
  //     );
  //   },
  //   [evmWallet.address, evmWallet.balance, evmWallet.ens],
  // );

  // const updateBalance = useCallback(
  //   async (address: string) => {
  //     const balance = await fetchBalance({ address: address as any });

  //     dispatch(
  //       updateEVMWallet({
  //         address: evmWallet.address,
  //         balance: Number.parseFloat(balance.formatted),
  //         ens: evmWallet.ens,
  //         nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  //       }),
  //     );
  //   },
  //   [evmWallet.address, evmWallet.balance, evmWallet.ens],
  // );

  // useEffect(() => {
  //   updateBalance(evmWallet.address)
  //     .then(() => fetchEns(evmWallet.address))
  //     .catch((error) =>
  //       logger.error(new ErrorLog(`Failed to fetch balance: ${JSON.stringify(error)}`), { type: 'query' }),
  //     );
  // }, [evmWallet.address]);

  return (
    <View style={[layout.flex_1, backgrounds.ui_background]}>
      <View style={[layout.center, layout.absolute, layout.z10, { paddingTop: insets.top }]}>
        <Header />
        <View style={[layout.w_90, layout.center, gutters.paddingVertical_32, gutters.gap_8]}>
          <Text style={[fonts.size_20, fonts.rubikBold, fonts.text_01]}>{formatCurrency(Number(4589.42))}</Text>
          <Text style={[fonts.size_14, fonts.rubikMedium, fonts.positive_01, fonts.center]}>
            {`10% (${formatCurrency(Number(45.89))}) Today`}
          </Text>
        </View>
        <Actions />
        <Wallets />
      </View>
    </View>
  );
}

export default Home;
