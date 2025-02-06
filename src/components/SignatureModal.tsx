import React, { useRef, useState } from 'react';
import { View, Modal, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';
import { InputField } from '../../src/components/InputField';

interface SignatureModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (signature: string, img1: string, img2: string, observacion: string) => void;
}

export const SignatureModal = ({ visible, onClose, onSave }: SignatureModalProps) => {
  const signatureRef = useRef<any>();
  const [isFirstImageDone, setIsFirstImageDone] = useState<boolean>(false);
  const [isSecondImageDone, setIsSecondImageDone] = useState<boolean>(false);
  const [img1b64, setImg1b64] = useState<string>("");
  const [img2b64, setImg2b64] = useState<string>("");
  const [observacion, setObservacion] = useState<string>("");

  const handleSignature = (signature: string) => {
    if(signature == "" || img1b64 == "" || img2b64 == "")
      return;
    onSave(signature, img1b64, img2b64, observacion);
  };

  const handleClear = () => {
    signatureRef.current?.clearSignature();
  };

  const handleConfirm = () => {
    signatureRef.current?.readSignature();
  };

  const pickImage = async (index: number) => {
    const { status } = await ImagePicker.
        requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
        Alert.alert(
            "Permiso Denegado",
            `Lo sentimos, necesitamos permisos de archivos para poder subir imagenes.`
        );
    } else {
        const result =
            await ImagePicker.launchImageLibraryAsync({
            quality: 0.9,
          });
        console.log(result);

        if (!result.canceled) {
            console.log(result);
            
          const manipResult = await ImageManipulator.manipulateAsync(
            result["assets"][0]["uri"],
            [{resize: { height: 250, width: 250 }}],
            { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
          );
          console.log(manipResult);
          if(manipResult.base64 && index == 1) {
            setImg1b64(manipResult.base64)
            setIsFirstImageDone(true);
          }
          
          if(manipResult.base64 && index == 2) {
            setImg2b64(manipResult.base64)
            setIsSecondImageDone(true);
          }
        }
    }
  };

  const style = `.m-signature-pad { box-shadow: none; border: 3; } 
    .m-signature-pad--body { border: none; }
    .m-signature-pad--footer { display: none; }
    body,html { width: 100%; height: 100%; }`;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Firma aquí</Text>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={() => console.log('empty')}
            webStyle={style}
          />
          <View style={styles.inputContainer}>
            <InputField
                label="Observación"
                value={observacion}
                onChangeText={setObservacion}
                isDisabled={false}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.pickButton1]} onPress={() => pickImage(1)}>
              <Text style={styles.buttonText}>{isFirstImageDone ? "Foto Inicial Subida" : "Subir Foto Inicial"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.pickButton2]} onPress={() => pickImage(2)}>
              <Text style={styles.buttonText}>{isSecondImageDone ? "Foto Final Subida" : "Subir Foto Final"}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleClear}>
              <Text style={styles.buttonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    height: 600,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  inputContainer: {
      width: '100%',
      padding: 10
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  pickButton1: {
    backgroundColor: '#3446eb',
  },
  pickButton2: {
    backgroundColor: '#1f2a8c',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 