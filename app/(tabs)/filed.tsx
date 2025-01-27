import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ServiceManager } from '../../src/services/services';
import type { Service } from '../../src/types/service';

export default function TabTwoScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoading(true);
      const response = await ServiceManager.getCurrentUserServices();

      if (response.status === 200) {
        // Filtrar solo los servicios finalizados
        const firmados = response.data.filter(service => service.estado === 'finalizado');
        setServices(firmados);
      } else {
        Alert.alert('Error', response.error || 'Error al cargar servicios');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = useCallback(() => {
    let filtered = [...services];

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

  const renderItem = ({ item }: { item: Service }) => (
    <View style={styles.item}>
      <View style={styles.headerContainer}>
        <Text style={styles.itemTitle}>{item.titulo}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.estado}</Text>
      </View>
      <Text style={styles.description}>
        {item.descripcion || 'Sin descripción disponible'}
      </Text>
      <Text style={styles.itemDate}>{item.fecha_hora_evento}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
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
          <Text style={styles.emptyText}>No hay servicios finalizados</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
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
  dateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  itemTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#32CD32',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    width: 100,
  },
  statusText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
  },
  itemDate: {
    color: '#888',
    fontSize: 12,
  },
  list: {
    paddingVertical: 12,
  },
  separator: {
    height: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
