import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Image
} from 'react-native';
import { router } from 'expo-router';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../src/types/navigation';
import { InputField } from '../src/components/InputField';
import { AuthService } from '../src/services/auth';
import type { LoginCredentials } from '../src/types/auth';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
    const [credentials, setCredentials] = useState<LoginCredentials>({
        identificacion: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const validateCredentials = (): boolean => {
        if (!credentials.identificacion || !credentials.password) {
            Alert.alert('Error', 'Por favor ingresa identificación y contraseña');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validateCredentials()) return;

        setIsLoading(true);
        try {
            const response = await AuthService.login(credentials);

            if (response.status === 200) {
                await AuthService.saveToken(response.data.token);
                router.push('/(tabs)');

            } else {
                Alert.alert('Error', response.error || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={'padding'}
            style={styles.container}
        >
            <View style={styles.content}>
                <Image
                    source={require('../assets/images/Multitanques.jpg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.inputContainer}>
                    <InputField
                        label="Identificación"
                        value={credentials.identificacion}
                        onChangeText={(text) => setCredentials(prev => ({ ...prev, identificacion: text }))}
                        isDisabled={isLoading}
                    />
                    <InputField
                        label="Contraseña"
                        value={credentials.password}
                        onChangeText={(text) => setCredentials(prev => ({ ...prev, password: text }))}
                        isPassword
                        isDisabled={isLoading}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="black" />
                    ) : (
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'grey',
        padding: 15,
        borderRadius: 5,
        width: '100%',
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: 'black',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    forgotPassword: {
        color: 'black',
        textAlign: 'center',
        fontSize: 14,
    },
    logo: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
});

