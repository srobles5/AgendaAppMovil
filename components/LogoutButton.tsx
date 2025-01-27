import { TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../src/types/navigation';
import { AuthService } from '../src/services/auth';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function LogoutButton() {
  const navigation = useNavigation<NavigationProp>();
  
  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await AuthService.logout();
              if (response.status === 200) {
                navigation.replace('home');
              } else {
                Alert.alert('Error', response.error || 'Error al cerrar sesión');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Error de conexión');
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={handleLogout}
      style={{ marginRight: 15 }}
    >
      <MaterialIcons name="logout" size={24} color="#2196F3" />
    </TouchableOpacity>
  );
} 