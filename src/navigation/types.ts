import type { StackScreenProps } from '@react-navigation/stack';
import type { WalletKitTypes } from '@reown/walletkit';
import type { Paths } from '@/navigation/paths';

export type RootStackParamList = {
  [Paths.Startup]: undefined;
  [Paths.Example]: undefined;
  [Paths.Onboarding]: undefined;
  [Paths.Welcome]: undefined;
  [Paths.CreateWallet]: undefined;
  [Paths.ImportWallet]: undefined;
  [Paths.SetPassword]: { mnemonic: string };
  [Paths.Home]: undefined;
  [Paths.Auth]: undefined;
  [Paths.Login]: undefined;
  [Paths.Reset]: undefined;
  [Paths.Root]: undefined;
  [Paths.Scan]: undefined;
  [Paths.WalletconnectSessions]: undefined;
  [Paths.SessionProposal]: {
    proposal: WalletKitTypes.SessionProposal;
    onApprove: () => void;
    onReject: () => void;
  };
  [Paths.SessionRequest]: {
    message: string;
    // TODO: use enum
    request_method: string;
    request: WalletKitTypes.SessionRequest;
    onApprove: () => void;
    onReject: () => void;
  };
};

export type RootScreenProps<S extends keyof RootStackParamList = keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  S
>;
