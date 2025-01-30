/* eslint-disable unicorn/consistent-function-scoping */
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '@/navigation/types';

import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Linking, Pressable, Text, useWindowDimensions, View } from 'react-native';
import { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme';
import { Paths } from '@/navigation/paths';

import { Button } from '@/components/animations';
import { getRandomColor } from '@/utils/theme';

export default function Welcome() {
  const { backgrounds, colors, fonts, gutters, layout } = useTheme();
  const { bottom } = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { t } = useTranslation(['welcome', 'common']);

  const leftColor = useSharedValue('#513eff');
  const rightColor = useSharedValue('#52e5ff');

  const bg_colors = useDerivedValue(() => [leftColor.value, rightColor.value], []);

  useEffect(() => {
    const interval = setInterval(() => {
      leftColor.value = withTiming(getRandomColor(), { duration: 3000 });
      rightColor.value = withTiming(getRandomColor(), { duration: 3000 });
    }, 3000);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createWallet = () => {
    navigation.navigate(Paths.CreateWallet);
  };

  const importWallet = () => {
    navigation.navigate(Paths.ImportWallet);
  };

  const openTerms = () => Linking.openURL('https://getrely.io/terms');

  return (
    <View style={layout.flex_1}>
      <Canvas style={layout.flex_1}>
        <Rect x={0} y={0} width={width} height={height}>
          <LinearGradient start={vec(0, 0)} end={vec(width, height)} colors={bg_colors} />
        </Rect>
      </Canvas>
      <View style={[layout.flex_1, layout.fullWidth, layout.fullHeight, layout.absolute, layout.center, layout.z1]}>
        <Text style={[fonts.white, fonts.rubikBold, fonts.size_24, gutters.marginBottom_12]}>Rely Wallet</Text>

        <Button
          size="xl"
          style={[backgrounds.ui_01, gutters.margin_10]}
          colorTransition={{
            colors: ['rgb(255,73,74)', 'rgb(255,170,0)', 'rgb(0,163,217)', 'rgb(0,163,217)', 'rgb(115,92,255)'],
            delay: 4000,
            duration: 8000,
          }}
          radius={24}
          border={{ width: 3 }}
          onPress={createWallet}
          shadow={{
            elevation: 8,
            offset: { width: 0, height: 0 },
            radius: 8,
            opacity: 0.4,
            color: colors.interactive_01,
          }}
          iconSpacing={12}
          startIcon={<Ionicons name="wallet-outline" size={24} color={colors.text_01} />}
          animation={{ type: 'pulse', config: { delay: 3000, duration: 600, scale: 0.96 } }}
          textStyle={[fonts.rubikMedium, fonts.text_01]}
          isDisabled={false}
          variant="outlined">
          {t('welcome:create_wallet')}
        </Button>

        <Button
          size="xl"
          style={[backgrounds.ui_01, gutters.margin_10]}
          radius={24}
          border={{ width: 3, color: colors.ui_01 }}
          onPress={importWallet}
          shadow={{
            elevation: 12,
            offset: { width: 0, height: 0 },
            radius: 12,
            opacity: 0.8,
            color: colors.shadow_01,
          }}
          iconSpacing={12}
          startIcon={<Ionicons name="key-outline" size={24} color={colors.text_01} />}
          animation={{ type: 'none' }}
          textStyle={[fonts.rubikMedium, fonts.text_01]}
          isDisabled={false}
          variant="outlined">
          {t('welcome:import_wallet')}
        </Button>
      </View>

      <View
        style={[
          layout.row,
          layout.center,
          layout.fullWidth,
          layout.absolute,
          layout.bottom0,
          layout.z1,
          { paddingBottom: bottom ? bottom : 12 },
        ]}>
        <Text style={[fonts.text_01, fonts.center, layout.center]}>{t('welcome:title')}</Text>
        <Pressable onPress={openTerms} style={layout.center}>
          <Text style={[fonts.text_04, fonts.center]}>{t('welcome:terms')}</Text>
        </Pressable>
      </View>
      <Image
        resizeMode="contain"
        source={require('@/theme/assets/images/wallet-money.png')}
        style={[
          layout.absolute,
          layout.opacity_75,
          {
            width: width * 0.8,
            height: (width * 0.8) / (width / 500),
            bottom: height > 800 ? height * 0.02 : height * -0.1,
            right: width * 0.12,
          },
        ]}
      />
    </View>
  );
}
