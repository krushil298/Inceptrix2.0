import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView as ExpoCameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { colors, borderRadius, spacing, typography } from '../../utils/theme';

interface CameraViewProps {
    onCapture: (uri: string) => void;
    onClose: () => void;
}

export default function CameraView({ onCapture, onClose }: CameraViewProps) {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<ExpoCameraView>(null);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionIcon}>📷</Text>
                <Text style={styles.permissionTitle}>Camera Access Needed</Text>
                <Text style={styles.permissionText}>
                    We need camera access to scan your crop leaves for disease detection.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });
                if (photo?.uri) {
                    onCapture(photo.uri);
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to take picture. Please try again.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <ExpoCameraView
                ref={cameraRef}
                style={styles.camera}
                facing={facing}
            >
                {/* Overlay guide */}
                <View style={styles.overlay}>
                    <View style={styles.topBar}>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleFacing} style={styles.flipButton}>
                            <Text style={styles.flipIcon}>🔄</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Viewfinder guide */}
                    <View style={styles.viewfinderContainer}>
                        <View style={styles.viewfinder}>
                            <View style={[styles.corner, styles.topLeft]} />
                            <View style={[styles.corner, styles.topRight]} />
                            <View style={[styles.corner, styles.bottomLeft]} />
                            <View style={[styles.corner, styles.bottomRight]} />
                        </View>
                        <Text style={styles.guideText}>Position the leaf within the frame</Text>
                    </View>

                    {/* Shutter */}
                    <View style={styles.bottomBar}>
                        <TouchableOpacity onPress={takePicture} style={styles.shutterOuter}>
                            <View style={styles.shutterInner} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ExpoCameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.base,
        paddingTop: 60,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    flipButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    flipIcon: {
        fontSize: 20,
    },
    viewfinderContainer: {
        alignItems: 'center',
    },
    viewfinder: {
        width: 260,
        height: 260,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: colors.accent,
        borderWidth: 3,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: 12,
    },
    topRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: 12,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: 12,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: 12,
    },
    guideText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: typography.sizes.sm,
        marginTop: spacing.base,
        textAlign: 'center',
    },
    bottomBar: {
        alignItems: 'center',
        paddingBottom: 50,
    },
    shutterOuter: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 4,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shutterInner: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#fff',
    },

    // Permission UI
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.xl,
    },
    permissionIcon: {
        fontSize: 64,
        marginBottom: spacing.lg,
    },
    permissionTitle: {
        fontSize: typography.sizes.xl,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    permissionText: {
        fontSize: typography.sizes.md,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    permissionButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.md,
        borderRadius: borderRadius.pill,
        marginBottom: spacing.md,
    },
    permissionButtonText: {
        color: colors.textOnPrimary,
        fontSize: typography.sizes.base,
        fontWeight: '600',
    },
    cancelButton: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
    },
    cancelButtonText: {
        color: colors.textSecondary,
        fontSize: typography.sizes.md,
    },
});
