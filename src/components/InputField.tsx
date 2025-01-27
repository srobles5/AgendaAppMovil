import { Text, TextInput, StyleSheet } from 'react-native';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  isPassword?: boolean;
  isDisabled?: boolean;
}

export const InputField = ({ 
  label, 
  value, 
  onChangeText, 
  isPassword = false, 
  isDisabled = false 
}: InputFieldProps) => (
  <>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={`Ingresa tu ${label.toLowerCase()}`}
      placeholderTextColor="#666"
      secureTextEntry={isPassword}
      autoCapitalize="none"
      value={value}
      onChangeText={onChangeText}
      editable={!isDisabled}
    />
  </>
);

const styles = StyleSheet.create({
  label: {
    color: 'black',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    width: '100%',
  },
}); 