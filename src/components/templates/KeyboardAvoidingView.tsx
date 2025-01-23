import { KeyboardAvoidingView, Platform } from 'react-native';

import { useTheme } from '@/theme';

function KeyboardAvoidingViewTemplate({ children }: { children: React.ReactNode }) {
  const { layout } = useTheme();

  return (
    <KeyboardAvoidingView
      style={[layout.flex_1, layout.center, layout.fullWidth]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {children}
    </KeyboardAvoidingView>
  );
}

export default KeyboardAvoidingViewTemplate;
