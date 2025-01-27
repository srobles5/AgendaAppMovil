import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { router } from 'expo-router';
import { ServiceManager } from '../../src/services/services';
import type { Service } from '../../src/types/service';
import { SignatureModal } from '../../src/components/SignatureModal';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function TabTwoScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showSignature, setShowSignature] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await ServiceManager.getCurrentUserServices();

      if (response.status === 200) {
        setServices(response.data);
      } else {
        console.error('Error response:', response);
        Alert.alert('Error', response.error || 'Error al cargar servicios');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchServices = async () => {
      try {
        const response = await ServiceManager.getCurrentUserServices();
        if (mounted && response.status === 200) {
          setServices(response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    fetchServices();

    return () => {
      mounted = false;
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pendiente':
        return '#FFA500';
      case 'en_progreso':
        return '#4169E1';
      case 'finalizado':
        return '#32CD32';
      case 'creado':
        return '#FFD700';
      default:
        return '#808080';
    }
  };

  const handleStartService = async (serviceId: number) => {
    Alert.alert(
      'Confirmar inicio',
      '¿Estás seguro de que deseas iniciar este servicio?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Iniciar',
          onPress: async () => {
            try {
              const response = await ServiceManager.setServiceInProgress(serviceId);
              if (response.status === 200) {
                loadServices();
                Alert.alert('Éxito', 'Servicio iniciado correctamente');
              } else {
                Alert.alert('Error', response.error || 'Error al iniciar el servicio');
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

  const handleSignService = (serviceId: number) => {
    Alert.alert(
      'Confirmar firma',
      '¿Deseas proceder a firmar este servicio?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Firmar',
          onPress: () => {
            setCurrentServiceId(serviceId);
            setShowSignature(true);
          }
        }
      ]
    );
  };

  const handleSaveSignature = async (signature: string) => {
    try {
      if (!currentServiceId) return;

      const signatureData = {
        firma: signature,
        observacion: null
      };

      const response = await ServiceManager.signService(currentServiceId, signatureData);
      if (response.status === 200) {
        loadServices();
        Alert.alert('Éxito', 'Servicio firmado correctamente');
      } else {
        Alert.alert('Error', response.error || 'Error al firmar el servicio');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error al procesar la firma');
    } finally {
      setShowSignature(false);
      setCurrentServiceId(null);
    }
  };

  const renderItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.item}
    >
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.titulo}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.estado) }]}>
          <Text style={styles.statusText}>{item.estado}</Text>
        </View>
      </View>

      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.descripcion}
      </Text>

      <View style={styles.itemDetails}>
        <Text style={styles.itemDate}>{item.fecha_hora_evento}</Text>
        <Text style={styles.itemClient}>{item.cliente.nombre}</Text>
      </View>

      <View style={styles.buttonContainer}>
        {item.estado === 'creado' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={() => handleStartService(item.id)}
          >
            <Text style={styles.buttonText}>Iniciar Servicio</Text>
          </TouchableOpacity>
        )}

        {item.estado === 'en_progreso' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.signButton]}
            onPress={() => handleSignService(item.id)}
          >
            <Text style={styles.buttonText}>Firmar</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const filterServices = useCallback(() => {
    let filtered = [...services].filter(service =>
      service.estado !== 'finalizado'
    );

    if (searchText) {
      filtered = filtered.filter(service =>
        service.cliente.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        service.titulo.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(service =>
        service.fecha_evento.includes(dateFilter)
      );
    }

    setFilteredServices(filtered);
  }, [services, searchText, dateFilter]);

  useEffect(() => {
    filterServices();
  }, [filterServices, services, searchText, dateFilter]);

  const onDateChange = (event: any, selected: Date | undefined) => {
    setShowDatePicker(false);
    if (selected) {
      setSelectedDate(selected);
      const formattedDate = selected.toISOString().split('T')[0];
      setDateFilter(formattedDate);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por cliente o título..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={styles.dateFilterContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {selectedDate 
                ? selectedDate.toLocaleDateString()
                : 'Seleccionar fecha'}
            </Text>
          </TouchableOpacity>
          {selectedDate && (
            <TouchableOpacity 
              style={styles.clearDateButton}
              onPress={() => {
                setSelectedDate(null);
                setDateFilter('');
              }}
            >
              <Text style={styles.clearDateText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <FlatList
        data={filteredServices}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        refreshing={isLoading}
        onRefresh={loadServices}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay servicios disponibles</Text>
          </View>
        )}
      />
      <TouchableOpacity
        onPress={loadServices}
      >
      </TouchableOpacity>
      <SignatureModal
        visible={showSignature}
        onClose={() => setShowSignature(false)}
        onSave={handleSaveSignature}
      />
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 16,
  },
  item: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemDate: {
    fontSize: 12,
    color: '#888',
  },
  itemClient: {
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  signButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  headerContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterContainer: {
    gap: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
  },
  dateButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#666',
    fontSize: 14,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearDateButton: {
    marginLeft: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearDateText: {
    fontSize: 16,
    color: '#666',
  },
});
