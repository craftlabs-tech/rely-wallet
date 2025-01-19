/* eslint-disable react/require-default-props */
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, Animated, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Animation = {
  type: 'pulse' | 'bounce' | 'none';
  config?: {
    scale?: number;
    duration?: number;
    delay?: number;
  };
};

type ColorTransition = {
  colors: string[];
  duration?: number;
  delay?: number;
};

type RippleConfig = {
  color?: string;
  duration?: number;
  maxScale?: number;
  centered?: boolean;
};

type ButtonVariant = 'filled' | 'outlined' | 'ghost' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface Props {
  children: React.ReactNode | string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle> | undefined;
  textStyle?: StyleProp<TextStyle> | undefined;
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  radius?: number | 'none' | 'full';
  border?: {
    width?: number;
    color?: string;
  };
  colors?: {
    background?: string;
    pressed?: string;
    text?: string;
    loading?: string;
  };
  animation?: Animation;
  colorTransition?: ColorTransition;
  ripple?: boolean | RippleConfig;
  loadingText?: string;
  loadingProps?: {
    size?: number | 'small' | 'large';
    color?: string;
  };
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconSpacing?: number;
  shadow?: {
    elevation?: number;
    color?: string;
    opacity?: number;
    radius?: number;
    offset?: { width: number; height: number };
  };
  feedback?: {
    haptic?: boolean;
    sound?: boolean;
  };
}

const DEFAULT_ANIMATION: Animation = {
  type: 'none',
  config: {
    scale: 0.96,
    duration: 600,
    delay: 3000,
  },
};

const DEFAULT_COLOR_TRANSITION: ColorTransition = {
  colors: ['#FF4A4B', '#FFAA00', '#00A3D9', '#735CFF', '#FF4A4B'],
  duration: 3000,
  delay: 3000,
};

const BUTTON_SIZES = {
  sm: {
    minHeight: 32,
    paddingHorizontal: 16,
    paddingVertical: 0,
    fontSize: 14,
    iconSize: 16,
  },
  md: {
    minHeight: 40,
    paddingHorizontal: 24,
    paddingVertical: 4,
    fontSize: 16,
    iconSize: 20,
  },
  lg: {
    minHeight: 48,
    paddingHorizontal: 32,
    paddingVertical: 8,
    fontSize: 18,
    iconSize: 24,
  },
  xl: {
    minHeight: 48,
    paddingHorizontal: 64,
    paddingVertical: 8,
    fontSize: 20,
    iconSize: 28,
  },
} as const;

function Button({
  children,
  style,
  textStyle,
  onPress,
  isDisabled = false,
  isLoading = false,
  variant = 'filled',
  size = 'md',
  radius = 8,
  border,
  colors = {
    background: '#1a1a1a',
    pressed: '#2a2a2a',
    text: '#ffffff',
    loading: '#ffffff',
  },
  animation = DEFAULT_ANIMATION,
  colorTransition,
  ripple = true,
  loadingText,
  loadingProps = {
    size: 'small',
    color: '#ffffff',
  },
  startIcon,
  endIcon,
  iconSpacing = 8,
  shadow = {
    elevation: 4,
    color: '#000000',
    opacity: 0.2,
    radius: 8,
    offset: { width: 0, height: 2 },
  },
  feedback = {
    haptic: false,
    sound: false,
  },
}: Props) {
  const animations = useMemo(
    () => ({
      scale: new Animated.Value(1),
      color: new Animated.Value(0),
      press: new Animated.Value(1),
    }),
    [],
  );

  const rippleAnim = useRef({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }).current;

  const { scale, color, press } = animations;
  const combinedScale = Animated.multiply(scale, press);

  const borderColor = useMemo(
    () =>
      color.interpolate({
        inputRange: [0, 0.25, 0.5, 0.75, 1],
        outputRange: colorTransition?.colors || DEFAULT_COLOR_TRANSITION.colors,
      }),
    [color, colorTransition],
  );

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    button: {
      minHeight: BUTTON_SIZES[size].minHeight,
      paddingHorizontal: BUTTON_SIZES[size].paddingHorizontal,
      paddingVertical: BUTTON_SIZES[size].paddingVertical,
      borderRadius: radius === 'full' ? BUTTON_SIZES[size].minHeight / 2 : radius === 'none' ? 0 : radius,
      backgroundColor: variant === 'filled' ? colors.background : 'transparent',
      opacity: isDisabled ? 0.5 : 1,
      borderWidth: variant === 'outlined' || border ? border?.width || 1 : 0,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    ripple: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: typeof ripple === 'object' ? ripple.color || 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.3)',
    },
    text: {
      fontSize: BUTTON_SIZES[size].fontSize,
      color: colors.text,
      fontWeight: '500' as const,
    },
  });

  const shadowStyle = useMemo(
    () =>
      Platform.select({
        ios: {
          shadowOffset: shadow.offset,
          shadowOpacity: shadow.opacity,
          shadowRadius: shadow.radius,
          shadowColor: shadow.color,
        },
        android: {
          elevation: shadow.elevation,
        },
      }),
    [shadow],
  );

  const ButtonStyle = useMemo(() => {
    const baseStyle = [
      styles.button,
      {
        borderColor:
          variant === 'outlined' ? (colorTransition ? borderColor : border?.color || colors.background) : border?.color,
        transform: [
          {
            scale: animation.type !== 'none' ? combinedScale : press,
          },
        ],
      },
      style,
    ];

    return baseStyle as unknown as Animated.WithAnimatedValue<ViewStyle>;
  }, [
    styles.button,
    variant,
    colorTransition,
    borderColor,
    border,
    colors.background,
    animation.type,
    combinedScale,
    press,
    style,
  ]);

  const startBaseAnimation = useCallback(() => {
    if (animation.type === 'none') {
      return;
    }

    const config = animation.config || DEFAULT_ANIMATION.config;

    if (animation.type === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: config?.scale || 0.96,
            duration: config?.duration || 600,
            useNativeDriver: false,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: config?.duration || 600,
            useNativeDriver: false,
          }),
          Animated.delay(config?.delay || 3000),
        ]),
      ).start();
    } else if (animation.type === 'bounce') {
      Animated.loop(
        Animated.sequence([
          Animated.spring(scale, {
            toValue: config?.scale || 0.96,
            friction: 3,
            tension: 40,
            useNativeDriver: false,
          }),
          Animated.spring(scale, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: false,
          }),
          Animated.delay(config?.delay || 3000),
        ]),
      ).start();
    }

    if (colorTransition) {
      startColorTransition();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animation.type, animation.config, colorTransition, scale]);

  const startColorTransition = useCallback(() => {
    const duration = colorTransition?.duration || DEFAULT_COLOR_TRANSITION.duration;
    const delay = colorTransition?.delay || DEFAULT_COLOR_TRANSITION.delay;

    Animated.loop(
      Animated.sequence([
        Animated.timing(color, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }),
        Animated.timing(color, {
          toValue: 0,
          duration,
          useNativeDriver: false,
        }),
        Animated.delay(delay as number),
      ]),
    ).start();
  }, [color, colorTransition]);

  const handlePressIn = useCallback(
    (event: unknown) => {
      if (feedback.haptic && Platform.OS === 'ios') {
        // Implement haptic feedback if needed
      }

      if (feedback.sound) {
        // Implement sound feedback if needed
      }

      Animated.spring(press, {
        toValue: 0.96,
        friction: 4,
        tension: 300,
        useNativeDriver: false,
      }).start();

      if (ripple) {
        const config = typeof ripple === 'object' ? ripple : {};

        rippleAnim.scale.setValue(0);
        rippleAnim.opacity.setValue(0.3);

        Animated.parallel([
          Animated.timing(rippleAnim.scale, {
            toValue: config.maxScale || 0.7,
            duration: config.duration || 400,
            useNativeDriver: false,
          }),
          Animated.timing(rippleAnim.opacity, {
            toValue: 0,
            duration: config.duration || 400,
            useNativeDriver: false,
          }),
        ]).start();
      }
    },
    [press, ripple, feedback, rippleAnim],
  );

  const handlePressOut = useCallback(() => {
    Animated.spring(press, {
      toValue: 1,
      friction: 4,
      tension: 300,
      useNativeDriver: false,
    }).start();
  }, [press]);

  useEffect(() => {
    if (!isDisabled && !isLoading) {
      startBaseAnimation();
    }

    return () => {
      scale.setValue(1);
      color.setValue(0);
      press.setValue(1);
      rippleAnim.scale.setValue(0);
      rippleAnim.opacity.setValue(0);
    };
  }, [isDisabled, isLoading, startBaseAnimation, scale, color, press, rippleAnim]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <ActivityIndicator color={loadingProps.color || colors.loading} size={loadingProps.size} />
          {loadingText && <Text style={[styles.text, { marginLeft: 8 }, textStyle]}>{loadingText}</Text>}
        </>
      );
    }

    return (
      <>
        {startIcon && <Animated.View style={{ marginRight: iconSpacing }}>{startIcon}</Animated.View>}
        {typeof children === 'string' ? <Text style={[styles.text, textStyle]}>{children}</Text> : children}
        {endIcon && <Animated.View style={{ marginLeft: iconSpacing }}>{endIcon}</Animated.View>}
      </>
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled || isLoading}
      style={[styles.container, shadowStyle]}
      activeOpacity={0.8}>
      <Animated.View style={ButtonStyle}>
        {ripple && (
          <Animated.View
            style={[
              styles.ripple,
              {
                borderRadius: styles.button.borderRadius,
                opacity: rippleAnim.opacity,
                transform: [{ scale: rippleAnim.scale }],
              },
            ]}
          />
        )}
        {renderContent()}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default Button;
