import React from 'react';
import { View } from "react-native";
import Modal from "react-native-modal";
import {Button, Text} from "native-base";

type Props = {
  isModalVisible: boolean;
  toggleModal: () => void;
}

const MyPhotoModal = (props: Props) => {
  return (
      <View style={{flex: 1}}>
        <Modal isVisible={props.isModalVisible}>
          <View style={{ flex: 1 }}>
            <Text>I am the modal content!</Text>
            <Button onPress={props.toggleModal} block iconLeft style={{flex: 0.1}}>
              <Text>closeModal</Text>
            </Button>
          </View>
        </Modal>
      </View>
  )
}

export default MyPhotoModal
