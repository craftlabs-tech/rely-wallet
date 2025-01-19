import type { StackScreenProps } from '@react-navigation/stack';
import type { Paths } from '@/navigation/paths';

export type RootStackParamList = {
  [Paths.Startup]: undefined;
  [Paths.Example]: undefined;
  [Paths.Onboarding]: undefined;
  [Paths.Welcome]: undefined;
  [Paths.Root]: undefined;
};

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  S
>;
