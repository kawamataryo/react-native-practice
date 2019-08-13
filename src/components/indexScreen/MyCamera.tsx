import React, { createRef } from "react";
import { View } from "react-native";
import { Button, Container, Icon, Text } from "native-base";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import Environment from "../../../config/enviroment";
import MyModal from "./MyModal";

interface Props {}

interface State {
  hasCameraPermission: boolean;
  ocrText: string;
  isModalVisible: boolean;
  loading: boolean;
}

export default class MyCamera extends React.Component<Props, State> {
  state = {
    hasCameraPermission: null,
    ocrText: "",
    isModalVisible: false,
    loading: false
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  private cameraRef = createRef<Camera>();

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible, ocrText: "" });
  };

  takePicture = async () => {
    if (this.cameraRef) {
      // modalの表示
      this.toggleModal();
      // 撮影
      let photo = await this.cameraRef.current.takePictureAsync({
        base64: true
      });
      // cloudVisionへデータを送信
      this.sendCloudVision(photo.base64);
    }
  };

  sendCloudVision = async (image: string) => {
    this.setState({ loading: true, isModalVisible: true });
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
    const resJson = await response.json();
    this.setState({
      ocrText: resJson.responses[0].textAnnotations[0].description as string,
      loading: false
    });
  };

  createRequestBody = (image: string): string => {
    return JSON.stringify({
      requests: [
        {
          features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          image: {
            content: image
          }
        }
      ]
    });
  };

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <Container style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} ref={this.cameraRef}>
            <View style={{ flex: 1 }}>
              <Button
                rounded
                icon
                onPress={this.takePicture}
                style={{
                  position: "absolute",
                  bottom: 100,
                  zIndex: 1,
                  alignSelf: "center",
                  height: 80,
                  width: 80,
                  flex: 1,
                  justifyContent: "center"
                }}
              >
                <Icon
                  name="camera"
                  style={{
                    fontSize: 50
                  }}
                />
              </Button>
              <MyModal
                toggleModal={this.toggleModal}
                isModalVisible={this.state.isModalVisible}
                ocrText={this.state.ocrText}
                loading={this.state.loading}
              />
            </View>
          </Camera>
        </Container>
      );
    }
  }
}
