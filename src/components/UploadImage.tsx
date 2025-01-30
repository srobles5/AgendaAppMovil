import React, { useState  } from 'react';
import { Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from 'expo-image-manipulator';

interface UploadImageProps {
    msg: string;
}

export const UploadImage = ({ msg }: UploadImageProps) => {
   // Function to pick an image from 
   //the device's media library
   const pickImage = async () => {
       const { status } = await ImagePicker.
           requestMediaLibraryPermissionsAsync();

       if (status !== "granted") {

           // If permission is denied, show an alert
           Alert.alert(
               "Permission Denied",
               `Sorry, we need camera 
                roll permission to upload images.`
           );
       } else {

           // Launch the image library and get
           // the selected image
           const result =
               await ImagePicker.launchImageLibraryAsync({
                // base64: true,
                quality:0.5,
              });
            console.log(result);

           if (!result.canceled) {

               // If an image is selected (not cancelled), 
               // update the file state variable
               console.log(result);
              //  setFile(result["assets"][0]["uri"]);
               
              const manipResult = await ImageManipulator.manipulateAsync(
                result["assets"][0]["uri"],
                [{resize: { height: 50, width: 50 }}],
                { compress: 1, format: ImageManipulator.SaveFormat.PNG, base64: true }
              );
              console.log(manipResult);
              console.log(manipResult.base64?.length)

               // Clear any previous errors
              //  setError(null);
           }
       }
   };

   return (
      <TouchableOpacity style={styles.button}
          onPress={pickImage}>
          <Text style={styles.buttonText}>
              {msg}
          </Text>
      </TouchableOpacity>
   );
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: "center",
       alignItems: "center",
       padding: 16,
   },
   header: {
       fontSize: 20,
       marginBottom: 16,
   },
   button: {
       backgroundColor: "#007AFF",
       padding: 10,
       borderRadius: 8,
       marginBottom: 16,
       shadowColor: "#000000",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.4,
       shadowRadius: 4,
       elevation: 5,
   },
   buttonText: {
       color: "#FFFFFF",
       fontSize: 16,
       fontWeight: "bold",
   },
   imageContainer: {
       borderRadius: 8,
       marginBottom: 16,
       shadowColor: "#000000",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.4,
       shadowRadius: 4,
       elevation: 5,
   },
   image: {
       width: 200,
       height: 200,
       borderRadius: 8,
   },
   errorText: {
       color: "red",
       marginTop: 16,
   },
});