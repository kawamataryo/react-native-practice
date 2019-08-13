import React, {createRef} from 'react';
import {Image, View} from 'react-native';
import {Button, Icon, Text, Card, CardItem, Content, Container} from 'native-base';
import {Camera} from 'expo-camera';
import * as Permissions from 'expo-permissions';
import Environment from "../../../config/enviroment";

interface Props {
}

interface State {
  hasCameraPermission: boolean,
  photoUri: string,
  ocrText: string,
}

export default class MyCamera extends React.Component<Props, State> {
  state = {
    hasCameraPermission: null,
    photoUri: '',
    ocrText: '',
  };

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  private cameraRef = createRef<Camera>()

  snap = async () => {
    if (this.cameraRef) {
      let photo = await this.cameraRef.current.takePictureAsync({base64: true});
      this.setState({photoUri: photo.uri});
      this.sendCloudVision(photo.base64);
    }
  };

  sendCloudVision = async (image: string) => {
    let body = this.createRequestBody(image);
    let response = await fetch(
        "https://vision.googleapis.com/v1/images:annotate?key=" +
        Environment["GOOGLE_CLOUD_VISION_API_KEY"],
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          body: body
        }
    );

    const res = await response.json();
    this.setState({ocrText: res.responses[0].textAnnotations[0].description as string})
    console.log(res.responses[0].textAnnotations[0].description)
  };

  createRequestBody = (image: string): string => {
    return JSON.stringify({
      requests: [
        {
          features: [
            { type: "TEXT_DETECTION", maxResults: 1 },
          ],
          image: {
            content: image
          }
        }
      ]
    })
  };

  render() {
    const {hasCameraPermission} = this.state;
    if (hasCameraPermission === null) {
      return <View/>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
          <Container style={{flex: 1}}>
            <Camera style={{flex: 1}}
                    ref={this.cameraRef}
            >
              <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                  }}>
              </View>
            </Camera>
            <Button onPress={this.snap} block iconLeft style={{flex: 0.1}}>
              <Icon name='camera'/>
              <Text>Take Photo</Text>
            </Button>
            <Content>
              <Card>
                <CardItem cardBody>
                  <Image source={{uri: this.state.photoUri}} style={{flex: 1, height: 200}}/>
                </CardItem>
                <CardItem>
                  <Text>{this.state.ocrText}</Text>
                </CardItem>
              </Card>
            </Content>
          </Container>
      );
    }
  }
}
