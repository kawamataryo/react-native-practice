import React from "react";
import { View, Clipboard, ScrollView } from "react-native";
import Modal from "react-native-modal";
import {
  Toast,
  Button,
  Card,
  CardItem,
  Spinner,
  Text,
  Icon
} from "native-base";

interface Props {
  isModalVisible: boolean;
  toggleModal: () => void;
  ocrText: string;
  loading: boolean;
}

const MyModal = (props: Props) => {
  const cardContent = () => {
    if (props.loading) {
      return (
        <CardItem style={{ justifyContent: "center" }}>
          <Spinner color="blue" />
        </CardItem>
      );
    } else {
      return (
        <CardItem>
          <ScrollView style={{ maxHeight: 300 }}>
            <Text selectable>{props.ocrText}</Text>
          </ScrollView>
        </CardItem>
      );
    }
  };

  const copyText = () => {
    Clipboard.setString(props.ocrText);
    props.toggleModal();
    Toast.show({
      text: "Copy Success",
      buttonText: "close",
      duration: 4000,
      type: "success",
      position: "bottom"
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal isVisible={props.isModalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Card style={{ zIndex: 1 }}>
            {cardContent()}
            <CardItem
              style={{
                flexDirection: "column"
              }}
            >
              <Button onPress={copyText} block iconLeft>
                <Icon name="copy" />
                <Text>copy text</Text>
              </Button>
            </CardItem>
          </Card>
        </View>
      </Modal>
    </View>
  );
};

export default MyModal;
