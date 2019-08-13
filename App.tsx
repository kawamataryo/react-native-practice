import React from 'react';
import { View } from 'native-base';
import MyCamera from "./src/components/indexScreen/MyCamera";

export default function App() {
  return (
      <View style={{flex: 1}}>
        <MyCamera/>
      </View>
  );
}

