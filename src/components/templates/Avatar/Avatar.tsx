import type { Address } from 'blo';
import type { RootState } from '@/store';

import { bloSvg } from 'blo';
import { Image, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useSelector } from 'react-redux';

import { useTheme } from '@/theme';

function Avatar({ address }: { address: string }) {
  const { components } = useTheme();

  const evmWallet = useSelector((s: RootState) => s.wallet.evm.find((w) => w.address === address));

  const svgBinary = bloSvg(address as Address);

  return evmWallet && evmWallet.ens && evmWallet.ens.avatarUrl ? (
    <Image source={{ uri: evmWallet.ens.avatarUrl }} style={[components.avatar]} />
  ) : (
    <View style={[components.avatar, { overflow: 'hidden' }]}>
      <SvgXml xml={svgBinary} height={48} width={48} />
    </View>
  );
}

export default Avatar;
