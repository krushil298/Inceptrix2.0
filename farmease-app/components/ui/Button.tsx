import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, typography, spacing, shadows } from '../../utils/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
    fullWidth?: boolean;
}

export default function Button({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    style,
    textStyle,
    fullWidth = false,
}: ButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'secondary':
                return { bg: colors.accent, text: colors.textOnPrimary };
            case 'outline':
                return { bg: 'transparent', text: colors.primary, border: colors.primary };
            case 'ghost':
                return { bg: 'transparent', text: colors.primary };
            default:
                return { bg: colors.primary, text: colors.textOnPrimary };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'sm':
                return { py: spacing.sm, px: spacing.base, fontSize: typography.sizes.sm };
            case 'lg':
                return { py: spacing.base, px: spacing.xl, fontSize: typography.sizes.lg };
            default:
                return { py: spacing.md, px: spacing.lg, fontSize: typography.sizes.base };
        }
    };

    const variantStyle = getVariantStyles();
    const sizeStyle = getSizeStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
            style={[
                styles.base,
                {
                    backgroundColor: variantStyle.bg,
                    paddingVertical: sizeStyle.py,
                    paddingHorizontal: sizeStyle.px,
                    borderColor: variantStyle.border || 'transparent',
                    borderWidth: variant === 'outline' ? 1.5 : 0,
                    opacity: disabled ? 0.5 : 1,
                    width: fullWidth ? '100%' : undefined,
                },
                shadows.sm,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variantStyle.text} size="small" />
            ) : (
                <>
                    {icon}
                    <Text style={[styles.text, { color: variantStyle.text, fontSize: sizeStyle.fontSize }, textStyle]}>
                        {title}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: borderRadius.pill,
        gap: spacing.sm,
    },
    text: {
        fontFamily: 'Poppins_600SemiBold',
        fontWeight: '600',
    },
});
