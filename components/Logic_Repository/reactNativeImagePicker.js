import {launchImageLibrary} from 'react-native-image-picker';

const reactNativeImagePicker = () => {
  return new Promise((resolve, reject) => {
    try {
      const options = {
        mediaType: "photo",
        includeBase64: false,
        quality: 1,
      };

      /**
       * The first arg is the options object for customization (it can also be null or omitted for default options),
       * The second arg is the callback which sends object: response (more info in the API Reference)
       */
      launchImageLibrary(options, (response) => {

        resolve(response)
      });
    }
    catch (e) {
      reject(e)
    }
  })

}


/*console.log('Response = ', response);

if (response.didCancel) {
  console.log('User cancelled image picker');
} else if (response.error) {
  console.log('ImagePicker Error: ', response.error);
} else if (response.customButton) {
  console.log('User tapped custom button: ', response.customButton);
} else {
  const source = { uri: response.uri };

  // You can also display the image using data:
  // const source = { uri: 'data:image/jpeg;base64,' + response.data };
}*/

export default reactNativeImagePicker
